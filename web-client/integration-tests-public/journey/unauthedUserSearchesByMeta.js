import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { COUNTRY_TYPES } = applicationContext.getConstants();

export const unauthedUserSearchesByMeta = (test, overrides = {}) => {
  return it('Search for cases by meta data', async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: 'Daenerys Stormborn',
      ...overrides,
    };

    test.setState('advancedSearchForm.caseSearchByName', queryParams);

    await test.runSequence('submitPublicCaseAdvancedSearchSequence', {});

    const searchResults = test.getState('searchResults');
    expect(searchResults.length).toBeGreaterThan(0);

    await test.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'caseSearchByName',
    });
    expect(test.getState('searchResults')).toBeUndefined();
    expect(test.getState('advancedSearchForm')).toEqual({
      caseSearchByName: { countryType: COUNTRY_TYPES.DOMESTIC },
      currentPage: 1,
    });
  });
};
