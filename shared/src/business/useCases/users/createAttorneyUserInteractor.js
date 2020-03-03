const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * createAttorneyUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createAttorneyUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.CREATE_ATTORNEY_USER)) {
    throw new UnauthorizedError('Unauthorized for creating attorney user');
  }

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createAttorneyUser({
      applicationContext,
      user,
    });

  return new User(createdUser, { applicationContext }).validate().toRawObject();
};