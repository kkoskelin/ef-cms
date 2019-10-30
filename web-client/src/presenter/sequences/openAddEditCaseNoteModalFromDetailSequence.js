import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAddEditCaseNoteModalStateFromDetailAction } from '../actions/TrialSessionWorkingCopy/setAddEditCaseNoteModalStateFromDetailAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openAddEditCaseNoteModalFromDetailSequence = [
  clearModalStateAction,
  setAddEditCaseNoteModalStateFromDetailAction,
  setShowModalFactoryAction('AddEditCaseNoteModal'),
];
