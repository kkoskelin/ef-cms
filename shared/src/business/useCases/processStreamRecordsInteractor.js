const AWS = require('aws-sdk');
const { createISODateString } = require('../utilities/DateHandler');

/**
 * recursively deletes the key from the item
 *
 * @param {object} item the object from which to delete the key
 * @param {string} key the key to delete recursively from the object
 * @returns {object} the record with all instances of the key removed
 */
const recursivelyDeleteKey = (item, key) => {
  Object.keys(item).some(function (k) {
    if (k === key) {
      delete item[k];
    }
    if (item[k] && typeof item[k] === 'object') {
      const returnItem = recursivelyDeleteKey(item[k], key);
      item[k] = returnItem;
    }
  });
  return item;
};

/**
 * deletes objects with dynamic keys and nested data to prevent hitting our ES mapping limit
 *
 * @param {object} record the object from which to delete unnecessary data
 * @returns {object} the record with unnecessary data removed
 */
const deleteDynamicAndNestedFields = record => {
  let data = record.dynamodb.NewImage;
  //dynamic keys
  if (data.qcCompleteForTrial) {
    delete data.qcCompleteForTrial;
  }
  if (data.caseMetadata) {
    delete data.caseMetadata;
  }
  //nested data
  data = recursivelyDeleteKey(data, 'workItems');
  data = recursivelyDeleteKey(data, 'draftState');

  record.dynamodb.NewImage = data;
  return record;
};

/**
 * filters out records we do not want to index with elasticsearch
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.records the array of records to filter
 * @returns {Array} the filtered records
 */
const filterRecords = async ({ applicationContext, records }) => {
  const filteredRecords = records.filter(
    record =>
      !record.dynamodb.Keys.pk.S.includes('work-item|') &&
      ['INSERT', 'MODIFY'].includes(record.eventName),
  );

  const caseRecords = filteredRecords.filter(record =>
    record.dynamodb.Keys.pk.S.includes('case|'),
  );

  for (let caseRecord of caseRecords) {
    const caseId = caseRecord.dynamodb.Keys.pk.S.split('|')[1];

    const fullCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });

    if (fullCase.caseId) {
      filteredRecords.push({
        dynamodb: {
          Keys: {
            pk: {
              S: caseRecord.dynamodb.Keys.pk.S,
            },
            sk: {
              S: caseRecord.dynamodb.Keys.pk.S,
            },
          },
          NewImage: AWS.DynamoDB.Converter.marshall(fullCase),
        },
        eventName: 'MODIFY',
      });
    }
  }

  return filteredRecords.map(deleteDynamicAndNestedFields);
};

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<object>} providers.recordsToProcess the records to process
 * @returns {object} the results of all the index calls for logging
 */
exports.processStreamRecordsInteractor = async ({
  applicationContext,
  recordsToProcess,
}) => {
  applicationContext.logger.info('Time', createISODateString());
  const searchClient = applicationContext.getSearchClient();
  const honeybadger = applicationContext.initHoneybadger();

  const filteredRecords = await filterRecords({
    applicationContext,
    records: recordsToProcess,
  });

  if (filteredRecords.length) {
    const body = filteredRecords
      .map(record => ({
        ...record.dynamodb.NewImage,
      }))
      .flatMap(doc => [
        { index: { _id: `${doc.pk.S}_${doc.sk.S}`, _index: 'efcms' } },
        doc,
      ]);

    try {
      const response = await searchClient.bulk({
        body,
        refresh: true,
      });

      if (response.body.errors) {
        for (let i = 0; i < response.body.items.length; i++) {
          const action = response.body.items[i];
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            let record = body[i * 2 + 1];

            try {
              await searchClient.index({
                body: { ...record },
                id: `${record.pk.S}_${record.sk.S}`,
                index: 'efcms',
              });
            } catch (e) {
              await applicationContext
                .getPersistenceGateway()
                .createElasticsearchReindexRecord({
                  applicationContext,
                  recordPk: record.pk.S,
                  recordSk: record.sk.S,
                });

              applicationContext.logger.info('Error', e);
              honeybadger && honeybadger.notify(e);
            }
          }
        }
      }
    } catch {
      //if the bulk index fails, try each single index individually and
      //add the failing ones to the reindex list
      const recordsToReprocess = await filterRecords({
        applicationContext,
        records: recordsToProcess,
      });

      for (const record of recordsToReprocess) {
        try {
          let newImage = record.dynamodb.NewImage;

          await searchClient.index({
            body: {
              ...newImage,
            },
            id: `${record.dynamodb.Keys.pk.S}_${record.dynamodb.Keys.sk.S}`,
            index: 'efcms',
          });
        } catch (e) {
          await applicationContext
            .getPersistenceGateway()
            .createElasticsearchReindexRecord({
              applicationContext,
              recordPk: record.dynamodb.Keys.pk.S,
              recordSk: record.dynamodb.Keys.sk.S,
            });

          applicationContext.logger.info('Error', e);
          honeybadger && honeybadger.notify(e);
        }
      }
    }
  }

  applicationContext.logger.info('Time', createISODateString());
};
