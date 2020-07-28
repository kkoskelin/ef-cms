const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  fileExternalDocumentForConsolidatedInteractor,
} = require('./fileExternalDocumentForConsolidatedInteractor');
const { MOCK_CASE } = require('../../../test/mockCase.js');

describe('fileExternalDocumentForConsolidatedInteractor', () => {
  let caseRecords;

  const docketNumber0 = '101-19';
  const docketNumber1 = '102-19';
  const docketNumber2 = '103-19';
  const documentId0 = 'd0d0d0d0-b37b-479d-9201-067ec6e335bb';
  const documentId1 = 'd1d1d1d1-b37b-479d-9201-067ec6e335bb';
  const documentId2 = 'd2d2d2d2-b37b-479d-9201-067ec6e335bb';
  const documentId3 = 'd3d3d3d3-b37b-479d-9201-067ec6e335bb';

  beforeEach(() => {
    caseRecords = [
      {
        caseCaption: 'Guy Fieri, Petitioner',
        caseId: '00000000-b37b-479d-9201-067ec6e335bb',
        caseType: CASE_TYPES_MAP.deficiency,
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Guy Fieri',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
        createdAt: '2019-04-19T17:29:13.120Z',
        docketNumber: docketNumber0,
        docketRecord: MOCK_CASE.docketRecord,
        documents: MOCK_CASE.documents,
        filingType: 'Myself',
        leadDocketNumber: docketNumber0,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        role: ROLES.petitioner,
        userId: 'petitioner',
      },
      {
        caseCaption: 'Enzo Ferrari, Petitioner',
        caseId: '11111111-b37b-479d-9201-067ec6e335bb',
        caseType: CASE_TYPES_MAP.deficiency,
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'ferrari@example.com',
          name: 'Enzo Ferrari',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
        createdAt: '2019-04-19T17:29:13.120Z',
        docketNumber: docketNumber1,
        docketRecord: MOCK_CASE.docketRecord,
        documents: MOCK_CASE.documents,
        filingType: 'Myself',
        leadDocketNumber: docketNumber0,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        role: ROLES.petitioner,
        userId: 'petitioner',
      },
      {
        caseCaption: 'George Foreman, Petitioner',
        caseId: '22222222-b37b-479d-9201-067ec6e335bb',
        caseType: CASE_TYPES_MAP.deficiency,
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'foreman@example.com',
          name: 'George Foreman',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
        createdAt: '2019-04-19T17:29:13.120Z',
        docketNumber: docketNumber2,
        docketRecord: MOCK_CASE.docketRecord,
        documents: MOCK_CASE.documents,
        filingType: 'Myself',
        leadDocketNumber: docketNumber0,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Fresno, California',
        procedureType: 'Regular',
        role: ROLES.petitioner,
        userId: 'petitioner',
      },
    ];

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Guy Fieri',
      role: ROLES.admin,
      userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Guy Fieri',
      role: ROLES.admin,
      userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    });

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockReturnValue(caseRecords);
  });

  it('should throw an error when not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileExternalDocumentForConsolidatedInteractor({
        applicationContext,
        documentIds: ['dddddddd-1111-dddd-1111-dddddddddddd'],
        documentMetadata: {
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should associate the document with all selected cases from the consolidated set', async () => {
    expect(caseRecords[0].documents.length).toEqual(4);
    expect(caseRecords[1].documents.length).toEqual(4);
    expect(caseRecords[2].documents.length).toEqual(4);

    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      docketNumbersForFiling: ['101-19', '102-19'],
      documentIds: [documentId0],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
      },
      leadDocketNumber: docketNumber0,
    });

    expect(result[0].documents[4].documentId).toEqual(documentId0);
    expect(result[1].documents[4].documentId).toEqual(documentId0);
    expect(result[2].documents.length).toEqual(4);
  });

  it('should generate a docket record entry on each case in the consolidated set', async () => {
    expect(caseRecords[0].docketRecord.length).toEqual(3);
    expect(caseRecords[1].docketRecord.length).toEqual(3);

    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      docketNumbersForFiling: ['101-19', '102-19'],
      documentIds: [documentId0],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
      },
      leadDocketNumber: docketNumber0,
    });

    expect(result[0].docketRecord[3].documentId).toEqual(documentId0);
    expect(result[1].docketRecord[3].documentId).toEqual(documentId0);
    expect(result[2].docketRecord[3].documentId).toEqual(documentId0);
  });

  // skipping this test until we have better acceptance criteria about consolidated cases
  it.skip('should aggregate the filing parties for the docket record entry', async () => {
    await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      documentIds: [documentId0],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
      },
      filingPartyNames: ['Guy Fieri', 'Enzo Ferrari'],
      leadDocketNumber: docketNumber0,
    });
  });

  it('should generate only ONE QC work item for the filing, to be found on the document of the lowest docket number case to be filed in', async () => {
    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      docketNumbersForFiling: ['101-19', '102-19'],
      documentIds: [documentId0],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
      },
      leadDocketNumber: docketNumber0,
    });

    const lowestDocketNumberCase = result.find(
      record => record.docketNumber === docketNumber0,
    );

    const nonLowestDocketNumberCase = result.find(
      record => record.docketNumber === docketNumber1,
    );

    expect(lowestDocketNumberCase.documents[4].workItems.length).toEqual(1);
    expect(nonLowestDocketNumberCase.documents[4].workItems.length).toEqual(0);
  });

  it('should file multiple documents for each case if a secondary document is provided', async () => {
    expect(caseRecords[0].documents.length).toEqual(4);
    expect(caseRecords[1].documents.length).toEqual(4);

    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      docketNumbersForFiling: ['101-19', '102-19'],
      documentIds: [documentId0, documentId1],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        secondaryDocument: {
          documentTitle: 'Redacted',
          documentType: 'Redacted',
          eventCode: 'REDC',
          filedBy: 'Test Petitioner',
        },
      },
      leadDocketNumber: docketNumber0,
    });

    expect(result[0].documents.length).toEqual(6);
    expect(result[1].documents.length).toEqual(6);
  });

  it('should file multiple documents for each case if supporting documents are provided', async () => {
    expect(caseRecords[0].documents.length).toEqual(4);
    expect(caseRecords[1].documents.length).toEqual(4);

    const result = await fileExternalDocumentForConsolidatedInteractor({
      applicationContext,
      docketNumbersForFiling: ['101-19', '102-19'],
      documentIds: [documentId0, documentId1, documentId2, documentId3],
      documentMetadata: {
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        secondaryDocument: {
          documentTitle: 'Redacted',
          documentType: 'Redacted',
          eventCode: 'REDC',
          filedBy: 'Test Petitioner',
        },
        secondarySupportingDocuments: [
          {
            documentTitle: 'Redacted',
            documentType: 'Redacted',
            eventCode: 'REDC',
            filedBy: 'Test Petitioner',
          },
        ],
        supportingDocuments: [
          {
            documentTitle: 'Redacted',
            documentType: 'Redacted',
            eventCode: 'REDC',
            filedBy: 'Test Petitioner',
          },
        ],
      },
      leadDocketNumber: docketNumber0,
    });

    expect(result[0].documents.length).toEqual(8);
    expect(result[1].documents.length).toEqual(8);
  });
});
