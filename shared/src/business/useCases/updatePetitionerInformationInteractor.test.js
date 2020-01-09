const {
  createISODateString,
  formatDateString,
} = require('../../../../shared/src/business/utilities/DateHandler');
const {
  getDocumentTypeForAddressChange,
} = require('../utilities/generateChangeOfAddressTemplate');
const {
  updatePetitionerInformationInteractor,
} = require('./updatePetitionerInformationInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

const updateCaseStub = jest.fn();
const generateChangeOfAddressTemplateStub = jest.fn();
const generatePdfFromHtmlInteractorStub = jest.fn();
const getAddressPhoneDiffStub = jest.fn();
const saveDocumentStub = jest.fn();

let persistenceGateway = {
  getCaseByCaseId: () => MOCK_CASE,
  saveDocument: saveDocumentStub,
  saveWorkItemForNonPaper: () => null,
  updateCase: updateCaseStub,
};

const useCases = {
  generatePdfFromHtmlInteractor: () => {
    generatePdfFromHtmlInteractorStub();
    return fakeFile;
  },
  userIsAssociated: () => true,
};

const userData = {
  name: 'administrator',
  role: User.ROLES.docketClerk,
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
};
let userObj = userData;
const applicationContext = {
  environment: { stage: 'local' },
  getCurrentUser: () => {
    return new User(userObj);
  },
  getPersistenceGateway: () => {
    return persistenceGateway;
  },
  getTemplateGenerators: () => {
    return {
      generateChangeOfAddressTemplate: async () => {
        generateChangeOfAddressTemplateStub();
        return '<html></html>';
      },
    };
  },
  getUniqueId: () => 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
  getUseCases: () => useCases,
  getUtilities: () => {
    return {
      createISODateString,
      formatDateString,
      getAddressPhoneDiff: () => {
        getAddressPhoneDiffStub();
        return {
          address1: {
            newData: 'new test',
            oldData: 'old test',
          },
        };
      },
      getDocumentTypeForAddressChange,
    };
  },
  logger: {
    time: () => null,
    timeEnd: () => null,
  },
};

describe('update petitioner contact information on a case', () => {
  beforeEach(() => {
    userObj = userData;
    jest.clearAllMocks();
  });

  it('updates case even if no change of address or phone is detected', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: MOCK_CASE.contactPrimary,
    });
    expect(generateChangeOfAddressTemplateStub).not.toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).not.toHaveBeenCalled();
    expect(updateCaseStub).toHaveBeenCalled();
  });

  it('updates petitioner contact when primary contact info changes', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: {
        address1: '456 Center St', // the address changes ONLY
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'Test Petitioner',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).toHaveBeenCalled();
  });
  it('updates petitioner contact when secondary contact info changes', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: MOCK_CASE.contactPrimary,
      contactSecondary: {
        address1: '789 Division St',
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'Test Petitioner',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).toHaveBeenCalled();
  });

  it('throws an error if the user making the request does not have permission to edit petition details', async () => {
    persistenceGateway.getCaseByCaseId = async () => ({
      ...MOCK_CASE,
    });
    userObj.role = User.ROLES.petitioner;
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow('Unauthorized for editing petition details');
  });
});
