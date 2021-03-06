const {
  addDocketEntryForOrderAndServe,
  addDocketEntryForOrderAndServePaper,
  createOrder,
  editAndSignOrder,
  goToCaseDetail,
} = require('../support/pages/case-detail');
const {
  closeScannerSetupDialog,
  goToCreateCase,
  goToReviewCase,
  serveCaseToIrs,
} = require('../support/pages/create-paper-case');
const {
  completeWizardStep1,
  completeWizardStep2,
  completeWizardStep3,
  completeWizardStep4,
  filingTypes,
  goToDashboard,
  goToStartCreatePetition,
  goToWizardStep1,
  goToWizardStep2,
  goToWizardStep3,
  goToWizardStep4,
  goToWizardStep5,
  hasIrsNotice,
  submitPetition,
} = require('../support/pages/create-electronic-petition');
const {
  fillInCreateCaseFromPaperForm,
} = require('../../cypress/support/pages/create-paper-petition');
const { getUserToken, login } = require('../support/pages/login');
const { goToMyDocumentQC } = require('../support/pages/document-qc');

let token = null;
const testData = {};

describe('Petitioner', () => {
  before(async () => {
    const results = await getUserToken(
      'petitioner1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create a case', () => {
    goToStartCreatePetition();
    goToWizardStep1();
    completeWizardStep1();
    goToWizardStep2();
    completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
    goToWizardStep3();
    completeWizardStep3(filingTypes.INDIVIDUAL, 'Petitioner');
    goToWizardStep4();
    completeWizardStep4();
    goToWizardStep5();
    submitPetition(testData);
    goToDashboard();
  });
});

describe('Petitions clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'petitionsclerk1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create a case with paper service', () => {
    goToMyDocumentQC();
    goToCreateCase();
    closeScannerSetupDialog();
    fillInCreateCaseFromPaperForm();
    goToReviewCase(testData);
    serveCaseToIrs();
  });
});

describe('Docket Clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create an order on the electronically-filed case and serve it', () => {
    goToCaseDetail(testData.createdDocketNumber);
    createOrder();
    editAndSignOrder();
    addDocketEntryForOrderAndServe();
  });

  it('should be able to create an order on the paper-filed case and serve it', () => {
    goToCaseDetail(testData.createdPaperDocketNumber);
    createOrder();
    editAndSignOrder();
    addDocketEntryForOrderAndServePaper();
  });
});
