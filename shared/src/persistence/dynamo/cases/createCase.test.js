const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));
const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const { createCase } = require('./createCase');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  isAuthorizedForWorkItems: () => true,
};

describe('createCase', () => {
  let params;
  let items;
  const CASE_ID = '123';
  const DOCKET_NUMBER = 'abc';
  const USER_ID = 'taxpayer';
  const CASE_RECORD = {
    caseId: CASE_ID,
    docketNumber: DOCKET_NUMBER,
    userId: USER_ID,
  };

  beforeEach(async () => {
    sinon.stub(client, 'batchWrite').resolves(null);
    await createCase({
      caseRecord: CASE_RECORD,
      applicationContext,
    });
    params = client.batchWrite.getCall(0).args[0];
    items = params.items;
  });

  afterEach(() => {
    client.batchWrite.restore();
  });

  it('persists the case record', async () => {
    expect(items).to.deep.include({
      pk: CASE_ID,
      sk: CASE_ID,
      ...CASE_RECORD,
    });
  });

  it('associates a docket number to a case id', async () => {
    expect(items).to.deep.include({
      pk: `${DOCKET_NUMBER}|case`,
      sk: CASE_ID,
    });
  });

  it('associates a new status to a case', async () => {
    expect(items).to.deep.include({
      pk: 'new|case-status',
      sk: CASE_ID,
    });
  });

  it('associates a user to a case', async () => {
    expect(items).to.deep.include({
      pk: `${USER_ID}|case`,
      sk: CASE_ID,
    });
  });
});
