import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generatePrintableFilingReceiptAction } from './generatePrintableFilingReceiptAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

const applicationContext = applicationContextForClient;

applicationContext.getUseCases().generatePrintableFilingReceiptInteractor = jest.fn();
presenter.providers.applicationContext = applicationContext;

describe('generatePrintableFilingReceiptAction', () => {
  it('should call generatePrintableFilingReceiptInteractor', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          caseId: '123',
          docketNumber: '123-19',
          primaryDocumentFile: {},
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(
      applicationContext.getUseCases().generatePrintableFilingReceiptInteractor,
    ).toHaveBeenCalled();
  });

  it('should generate a receipt with supporting documents', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          caseId: '123',
          docketNumber: '123-19',
          hasSupportingDocuments: true,
          primaryDocumentFile: {},
          supportingDocuments: [{}],
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(
      applicationContext.getUseCases().generatePrintableFilingReceiptInteractor
        .mock.calls[0][0].documents,
    ).toHaveProperty('supportingDocuments');
  });

  it('should generate a receipt with a secondary document', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          caseId: '123',
          docketNumber: '123-19',
          primaryDocumentFile: {},
          secondaryDocument: {},
          secondaryDocumentFile: {},
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(
      applicationContext.getUseCases().generatePrintableFilingReceiptInteractor
        .mock.calls[0][0].documents,
    ).toHaveProperty('secondaryDocument');
  });

  it('should generate a receipt with secondary supporting documents', async () => {
    await runAction(generatePrintableFilingReceiptAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: {
          caseId: '123',
          docketNumber: '123-19',
          hasSecondarySupportingDocuments: true,
          primaryDocumentFile: {},
          secondaryDocument: {},
          secondaryDocumentFile: {},
          secondarySupportingDocuments: [{}],
        },
      },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(
      applicationContext.getUseCases().generatePrintableFilingReceiptInteractor
        .mock.calls[0][0].documents,
    ).toHaveProperty('secondarySupportingDocuments');
  });
});
