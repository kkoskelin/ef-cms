import { setupTest } from './helpers';
import { setupTest as setupTestClient } from '../integration-tests/helpers';
import { unauthedUserInvalidSearchForOpinion } from './journey/unauthedUserInvalidSearchForOpinion';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import { unauthedUserSearchesForOpinionByKeyword } from './journey/unauthedUserSearchesForOpinionByKeyword';

const test = setupTest();
const testClient = setupTestClient();

describe('Unauthed user searches for an opinion by keyword', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserInvalidSearchForOpinion(test);
  unauthedUserSearchesForOpinionByKeyword(test, testClient);
});
