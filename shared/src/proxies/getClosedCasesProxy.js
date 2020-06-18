const { get } = require('./requests');

/**
 * getClosedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getClosedCasesInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/cases/closed',
  });
};