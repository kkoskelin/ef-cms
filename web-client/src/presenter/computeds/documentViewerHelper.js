import { getShowNotServedForDocument } from './getShowNotServedForDocument';
import { state } from 'cerebral';

export const documentViewerHelper = (get, applicationContext) => {
  const { UNSERVABLE_EVENT_CODES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail,
    });

  const viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);

  const formattedDocumentToDisplay =
    viewerDocumentToDisplay &&
    formattedCaseDetail.docketRecordWithDocument.find(
      entry =>
        entry.document &&
        entry.document.documentId === viewerDocumentToDisplay.documentId,
    );
  if (!formattedDocumentToDisplay) {
    return {};
  }

  const filedLabel = formattedDocumentToDisplay.document.filedBy
    ? `Filed ${formattedDocumentToDisplay.document.createdAtFormatted} by ${formattedDocumentToDisplay.document.filedBy}`
    : '';

  const { servedAtFormatted } = formattedDocumentToDisplay.document;
  const servedLabel = servedAtFormatted ? `Served ${servedAtFormatted}` : '';

  const showNotServed = getShowNotServedForDocument({
    UNSERVABLE_EVENT_CODES,
    caseDetail,
    documentId: formattedDocumentToDisplay.document.documentId,
    draftDocuments: formattedCaseDetail.draftDocuments,
  });

  return {
    description: formattedDocumentToDisplay.record.description,
    filedLabel,
    servedLabel,
    showNotServed,
    showSealedInBlackstone: formattedDocumentToDisplay.document.isLegacySealed,
  };
};
