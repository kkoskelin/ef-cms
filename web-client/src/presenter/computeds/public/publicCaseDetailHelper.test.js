import { applicationContextPublic } from '../../../applicationContextPublic';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from './publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

const publicCaseDetailHelper = withAppContextDecorator(
  publicCaseDetailHelperComputed,
  applicationContextPublic,
);

let state;
describe('publicCaseDetailHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: {
        docketNumber: '123-45',
        docketRecord: [],
      },
    };
  });

  it('should return the formattedDocketRecordWithDocument as an array', () => {
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(
      Array.isArray(result.formattedDocketRecordWithDocument),
    ).toBeTruthy();
  });

  it('should format docket record with document and sort chronologically', () => {
    state.caseDetail.docketRecord = [
      {
        description: 'first record',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        filingDate: '2018-11-21T20:49:28.192Z',
        index: 4,
      },
      {
        description: 'second record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
        filingDate: '2018-10-21T20:49:28.192Z',
        index: 1,
      },
      {
        description: 'third record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
        filingDate: '2018-10-25T20:49:28.192Z',
        index: 3,
      },
      {
        description: 'fourth record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
        filingDate: '2018-10-25T20:49:28.192Z',
        index: 2,
      },
    ];
    state.caseDetail.documents = [
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        documentTitle: 'Petition',
        documentType: 'Petition',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Statement of Taxpayer Identification',
        documentType: 'Statement of Taxpayer Identification',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-10-21T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
        documentTitle: 'Order to do something',
        documentType: 'O - Order',
        eventCode: 'O',
        processingStatus: 'pending',
        servedAt: '2018-11-27T20:49:28.192Z',
        status: 'served',
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
        documentTitle: 'Order to do something else',
        documentType: 'O - Order',
        eventCode: 'O',
        processingStatus: 'pending',
      },
    ];
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(result.formattedDocketRecordWithDocument).toMatchObject([
      {
        document: {
          createdAtFormatted: '10/21/18',
          isCourtIssuedDocument: false,
          isInProgress: false,
          isNotServedCourtIssuedDocument: false,
          isStatusServed: false,
          showServedAt: false,
        },
        record: {
          createdAtFormatted: '10/21/18',
          description: 'second record',
          filingsAndProceedings: '',
        },
      },
      {
        document: {
          createdAtFormatted: '10/25/18',
          isCourtIssuedDocument: true,
          isInProgress: false,
          isNotServedCourtIssuedDocument: true,
          isStatusServed: false,
          showServedAt: false,
        },
        record: {
          createdAtFormatted: undefined,
          description: 'fourth record',
          filingsAndProceedings: '',
        },
      },
      {
        document: {
          createdAtFormatted: '10/25/18',
          isCourtIssuedDocument: true,
          isInProgress: false,
          isNotServedCourtIssuedDocument: false,
          isStatusServed: true,
          servedAtFormatted: '11/27/18 03:49 pm',
          showServedAt: true,
        },
        record: {
          createdAtFormatted: '10/25/18',
          description: 'third record',
          filingsAndProceedings: '',
        },
      },
      {
        document: {
          createdAtFormatted: '11/21/18',
          isCourtIssuedDocument: false,
          isInProgress: false,
          isNotServedCourtIssuedDocument: false,
          isStatusServed: false,
          showServedAt: false,
        },
        record: {
          createdAtFormatted: '11/21/18',
          description: 'first record',
          filingsAndProceedings: '',
        },
      },
    ]);
  });
});