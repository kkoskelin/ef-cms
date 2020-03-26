import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getAllCaseDeadlinesAction } from './getAllCaseDeadlinesAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

applicationContext.getUseCases().getAllCaseDeadlinesInteractor = jest.fn();
presenter.providers.applicationContext = applicationContext;

describe('getAllCaseDeadlinesAction', () => {
  it('gets all case deadlines', async () => {
    applicationContext
      .getUseCases()
      .getAllCaseDeadlinesInteractor.mockReturnValue('hello world');

    const result = await runAction(getAllCaseDeadlinesAction, {
      modules: {
        presenter,
      },
    });
    expect(result.output.caseDeadlines).toEqual('hello world');
  });
});
