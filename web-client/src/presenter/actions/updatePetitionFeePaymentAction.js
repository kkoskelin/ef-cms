import { state } from 'cerebral';

/**
 * updates petition fee payment information on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseId, tab, caseDetail
 */
export const updatePetitionFeePaymentAction = async ({
  applicationContext,
  get,
}) => {
  const caseToUpdate = get(state.caseDetail);
  const form = get(state.form);

  const petitionPaymentWaivedDate = applicationContext
    .getUtilities()
    .createISODateStringFromObject({
      day: form.paymentDateWaivedDay,
      month: form.paymentDateWaivedMonth,
      year: form.paymentDateWaivedYear,
    });

  const petitionPaymentDate = applicationContext
    .getUtilities()
    .createISODateStringFromObject({
      day: form.paymentDateDay,
      month: form.paymentDateMonth,
      year: form.paymentDateYear,
    });

  const { petitionPaymentMethod, petitionPaymentStatus } = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updatePetitionFeePaymentInteractor({
      applicationContext,
      caseId: caseToUpdate.caseId,
      petitionPaymentDate,
      petitionPaymentMethod,
      petitionPaymentStatus,
      petitionPaymentWaivedDate,
    });

  return {
    alertSuccess: {
      title: 'Your changes have been saved.',
    },
    caseDetail: updatedCase,
    caseId: updatedCase.docketNumber,
    tab: 'caseInfo',
  };
};