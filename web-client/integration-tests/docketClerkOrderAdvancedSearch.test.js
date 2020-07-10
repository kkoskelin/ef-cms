import { DocumentSearch } from '../../shared/src/business/entities/documents/DocumentSearch';
import {
  FORMATS,
  calculateISODate,
  createISODateString,
  deconstructDate,
  formatDateString,
} from '../../shared/src/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrderOfDismissal } from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
  wait,
} from './helpers';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

const {
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = applicationContext.getConstants();

const seedData = {
  caseCaption: 'Hanan Al Hroub, Petitioner',
  caseId: '1a92894e-83a5-48ba-9994-3ada44235deb',
  contactPrimary: {
    address1: '123 Teachers Way',
    city: 'Haifa',
    country: 'Palestine',
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    name: 'Hanan Al Hroub',
    postalCode: '123456',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  },
  contactSecondary: {},
  docketNumber: '104-20',
  docketNumberSuffix: 'R',
  documentContents:
    'Déjà vu, this is a seed order filed on Apr 13 at 11:01pm ET',
  documentId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
  documentTitle: 'Order of Dismissal and Decision Entered, Judge Buch',
  filingDate: '2020-04-14T03:01:15.215Z',
  signedJudgeName: 'Maurice B. Foley',
};
const signedByJudge = 'Maurice B. Foley';
let caseDetail;

describe('docket clerk order advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    test.draftOrders = [];
    global.window.pdfjsObj = {
      getData: () => Promise.resolve(new Uint8Array(fakeFile)),
    };
  });

  describe('performing data entry', () => {
    loginAs(test, 'petitioner@example.com');
    it('create case', async () => {
      caseDetail = await uploadPetition(test);
      expect(caseDetail).toBeDefined();
      test.docketNumber = caseDetail.docketNumber;
    });

    loginAs(test, 'docketclerk@example.com');
    docketClerkCreatesAnOrder(test, {
      documentTitle: 'Order',
      eventCode: 'O',
      expectedDocumentType: 'Order',
      signedAtFormatted: '01/02/2020',
    });
    docketClerkSignsOrder(test, 0);
    docketClerkAddsDocketEntryFromOrder(test, 0);
    docketClerkServesDocument(test, 0);

    docketClerkCreatesAnOrder(test, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkSignsOrder(test, 1);
    docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);

    docketClerkCreatesAnOrder(test, {
      documentTitle: 'Order of Dismissal',
      eventCode: 'OD',
      expectedDocumentType: 'Order of Dismissal',
    });
    docketClerkSignsOrder(test, 2);
    docketClerkAddsDocketEntryFromOrderOfDismissal(test, 2);
    docketClerkServesDocument(test, 2);

    docketClerkCreatesAnOrder(test, {
      documentTitle: 'Order of something',
      eventCode: 'O',
      expectedDocumentType: 'Order',
    });
    docketClerkSignsOrder(test, 3);
    docketClerkAddsDocketEntryFromOrder(test, 3);
    docketClerkServesDocument(test, 3);
    docketClerkSealsCase(test);
  });

  describe('search form default behavior', () => {
    it('go to advanced order search tab', async () => {
      await refreshElasticsearchIndex();

      await test.runSequence('gotoAdvancedSearchSequence');

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('validationErrors')).toEqual({
        keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
      });
    });

    it('clears search fields', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseDetail.caseCaption,
          docketNumber: caseDetail.docketNumber,
          keyword: 'dismissal',
        },
      });

      await test.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'orderSearch',
      });

      expect(test.getState('advancedSearchForm.orderSearch')).toEqual({
        keyword: '',
      });
    });

    it('clears validation errors when switching tabs', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {},
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('alertError')).toEqual({
        messages: ['Enter a keyword or phrase'],
        title: 'Please correct the following errors:',
      });

      await test.runSequence('advancedSearchTabChangeSequence');

      expect(test.getState('alertError')).not.toBeDefined();
    });
  });

  describe('search for things that should not be found', () => {
    it('search for a keyword that is not present in any served order', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'osteodontolignikeratic',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('validationErrors')).toEqual({});
      expect(test.getState('searchResults')).toEqual([]);
    });

    it('search for a docket number that is not present in any served orders', async () => {
      const docketNumberNoOrders = '999-99';

      test.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: docketNumberNoOrders,
          keyword: 'dismissal',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual([]);
    });

    it('search for a case title that is not present in any served orders', async () => {
      const caseCaptionNoOrders = 'abcdefghijk';

      test.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseCaptionNoOrders,
          keyword: 'dismissal',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual([]);
    });

    it('search for a date range that does not contain served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          endDateDay: '03',
          endDateMonth: '01',
          endDateYear: '2005',
          keyword: 'dismissal',
          startDateDay: '01',
          startDateMonth: '01',
          startDateYear: '2005',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual([]);
    });

    it('search for a judge that has not signed any served orders', async () => {
      const invalidJudge = 'Judge Exotic';

      test.setState('advancedSearchForm', {
        orderSearch: {
          judge: invalidJudge,
          keyword: 'dismissal',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual([]);
    });
  });

  describe('search for things that should be found', () => {
    it('search for a keyword that is present in served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'dismissal',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[2].documentId,
            isSealed: true,
          }),
        ]),
      );
      expect(test.getState('searchResults')).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[1].documentId,
          }),
        ]),
      );
    });

    it('search for a docket number that is present in served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          docketNumber: caseDetail.docketNumber,
          keyword: 'dismissal',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[2].documentId,
          }),
        ]),
      );
      expect(test.getState('searchResults')).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[1].documentId,
          }),
        ]),
      );
    });

    it('search for a case title that is present in served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          caseTitleOrPetitioner: caseDetail.caseCaption,
          keyword: 'dismissal',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[2].documentId,
          }),
        ]),
      );
      expect(test.getState('searchResults')).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[1].documentId,
          }),
        ]),
      );
    });

    it('search for a date range that contains served orders', async () => {
      const endOrderCreationMoment = calculateISODate({
        howMuch: 1,
        unit: 'months',
      });
      const startOrderCreationMoment = calculateISODate({
        howMuch: -1,
        unit: 'months',
      });

      const {
        day: endDateDay,
        month: endDateMonth,
        year: endDateYear,
      } = deconstructDate(
        formatDateString(
          createISODateString(endOrderCreationMoment),
          FORMATS.MMDDYYYY,
        ),
      );
      const {
        day: startDateDay,
        month: startDateMonth,
        year: startDateYear,
      } = deconstructDate(
        formatDateString(
          createISODateString(startOrderCreationMoment),
          FORMATS.MMDDYYYY,
        ),
      );

      test.setState('advancedSearchForm', {
        orderSearch: {
          endDateDay,
          endDateMonth,
          endDateYear,
          keyword: 'dismissal',
          startDateDay,
          startDateMonth,
          startDateYear,
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      await refreshElasticsearchIndex();

      await wait(5000);

      expect(test.getState('searchResults')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[2].documentId,
          }),
        ]),
      );
      expect(test.getState('searchResults')).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[1].documentId,
          }),
        ]),
      );
    });

    it('search for a judge that has signed served orders', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          judge: signedByJudge,
          keyword: 'dismissal',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ documentId: seedData.documentId }),
        ]),
      );
      expect(test.getState('searchResults')).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentId: test.draftOrders[1].documentId,
          }),
        ]),
      );
    });

    it('includes the number of pages present in each document in the search results', async () => {
      test.setState('advancedSearchForm', {
        orderSearch: {
          keyword: 'Order of Dismissal Entered',
        },
      });

      await test.runSequence('submitOrderAdvancedSearchSequence');

      expect(test.getState('searchResults')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            numberOfPages: 1,
          }),
        ]),
      );
    });
  });
});
