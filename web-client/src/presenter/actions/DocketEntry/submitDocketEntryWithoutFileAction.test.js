import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryWithoutFileAction } from './submitDocketEntryWithoutFileAction';

applicationContext.getUseCases().fileDocketEntryInteractor = jest.fn();
presenter.providers.applicationContext = applicationContext;

describe('submitDocketEntryWithoutFileAction', () => {
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };
  });

  it('should call fileDocketEntryInteractor and return caseDetail', async () => {
    applicationContext
      .getUseCases()
      .fileDocketEntryInteractor.mockReturnValue(caseDetail);

    const result = await runAction(submitDocketEntryWithoutFileAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().fileDocketEntryInteractor,
    ).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});
