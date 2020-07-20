import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * gets the first docket entry document from the current case detail to set as the default viewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultDocketViewerDocumentToDisplayAction = ({
  applicationContext,
  get,
}) => {
  const documentId = get(state.documentId);
  let viewerDocumentToDisplay = null;

  if (!documentId) {
    viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);
  }

  if (viewerDocumentToDisplay) return { viewerDocumentToDisplay };

  const { docketRecord, documents } = get(state.caseDetail);

  const formattedDocketRecordWithDocument = applicationContext
    .getUtilities()
    .formatDocketRecordWithDocument(
      applicationContext,
      cloneDeep(docketRecord),
      cloneDeep(documents),
    );

  const entriesWithDocument = formattedDocketRecordWithDocument.filter(
    entry => !!entry.document,
  );

  if (entriesWithDocument && entriesWithDocument.length) {
    if (documentId) {
      viewerDocumentToDisplay = entriesWithDocument.find(
        d => d.document.documentId === documentId,
      ).document;
    } else {
      viewerDocumentToDisplay = entriesWithDocument[0].document;
    }
  }

  return {
    viewerDocumentToDisplay,
  };
};
