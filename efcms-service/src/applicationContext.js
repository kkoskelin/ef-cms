const awsDynamoPersistence = require('ef-cms-shared/src/persistence/awsDynamoPersistence');
const docketNumberGenerator = require('ef-cms-shared/src/persistence/docketNumberGenerator');
const awsS3Persistence = require('ef-cms-shared/src/persistence/awsS3Persistence');
const irsGateway = require('ef-cms-shared/src/persistence/irsGateway');
const { createCase } = require('ef-cms-shared/src/useCases/createCase');
const { getCase } = require('ef-cms-shared/src/useCases/getCase');
const { getCasesByStatus } = require('ef-cms-shared/src/useCases/getCasesByStatus');
const { getCasesByUser } = require('ef-cms-shared/src/useCases/getCasesByUser');
const { getUser } = require('ef-cms-shared/src/useCases/getUser');
const { sendPetitionToIRS } = require('ef-cms-shared/src/useCases/sendPetitionToIRS');
const { updateCase } = require('ef-cms-shared/src/useCases/updateCase');
const { uploadCasePdfs } = require('ef-cms-shared/src/useCases/uploadCasePdfs');

module.exports = {
  persistence: {
    ...awsDynamoPersistence,
    ...awsS3Persistence
  },
  docketNumberGenerator,
  irsGateway,
  environment: {
    stage: process.env.STAGE || 'local',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
    documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  },
  getUseCases: () => {
    return {
      createCase,
      getCase,
      getCasesByStatus,
      getCasesByUser,
      getUser,
      sendPetitionToIRS,
      updateCase,
      uploadCasePdfs,
    };
  },
};
