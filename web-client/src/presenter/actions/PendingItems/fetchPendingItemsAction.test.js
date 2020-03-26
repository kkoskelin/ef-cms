import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { fetchPendingItemsAction } from './fetchPendingItemsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

applicationContextForClient.getUseCases().fetchPendingItemsInteractor = jest.fn();
presenter.providers.applicationContext = applicationContextForClient;

describe('fetchPendingItemsAction', () => {
  applicationContextForClient
    .getUseCases()
    .fetchPendingItemsInteractor.mockResolvedValue(['some content']);

  it('updates pendingItems', async () => {
    const result = await runAction(fetchPendingItemsAction, {
      modules: {
        presenter,
      },
      props: {
        judge: 'Judge Armen',
      },
    });

    expect(
      applicationContextForClient.getUseCases().fetchPendingItemsInteractor,
    ).toBeCalled();
    expect(result.output.pendingItems).toEqual(['some content']);
  });
});
