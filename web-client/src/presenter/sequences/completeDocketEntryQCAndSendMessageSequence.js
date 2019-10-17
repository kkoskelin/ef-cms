import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { completeDocketEntryQCAction } from '../actions/EditDocketRecord/completeDocketEntryQCAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { createWorkItemAction } from '../actions/createWorkItemAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updateWorkItemFromPropsOrModalOrFormAction } from '../actions/WorkItem/updateWorkItemFromPropsOrModalOrFormAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';

export const completeDocketEntryQCAndSendMessageSequence = [
  clearAlertsAction,
  startShowValidationAction,
  updateWorkItemFromPropsOrModalOrFormAction,
  validateInitialWorkItemMessageAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: [
      stopShowValidationAction,
      setWaitingForResponseAction,
      computeDateReceivedAction,
      computeCertificateOfServiceFormDateAction,
      completeDocketEntryQCAction,
      createWorkItemAction,
      {
        success: [
          clearFormAction,
          clearScreenMetadataAction,
          clearUsersAction,
          clearModalAction,
          clearModalStateAction,
          ({ props }) => ({
            alertSuccess: {
              message: `${props.updatedDocument.documentTitle} has been completed and message sent.`,
              title: 'QC Completed',
            },
          }),
          setSaveAlertsForNavigationAction,
          setCaseAction,
          setAlertSuccessAction,
          unsetWaitingForResponseAction,
          navigateToCaseDetailAction,
        ],
      },
    ],
  },
];