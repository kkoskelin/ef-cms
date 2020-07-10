const fs = require('fs');
const json2yaml = require('json2yaml');
const {
  ContactFactory,
} = require('../business/entities/contacts/ContactFactory');
const {
  getNextFriendForIncompetentPersonContact,
} = require('../business/entities/contacts/NextFriendForIncompetentPersonContact');
const {
  getNextFriendForMinorContact,
} = require('../business/entities/contacts/NextFriendForMinorContact');
const {
  getOtherFilerContact,
} = require('../business/entities/contacts/OtherFilerContact');
const {
  getPartnershipAsTaxMattersPartnerPrimaryContact,
} = require('../business/entities/contacts/PartnershipAsTaxMattersPartnerContact');
const {
  getPartnershipBBAPrimaryContact,
} = require('../business/entities/contacts/PartnershipBBAContact');
const {
  getPartnershipOtherThanTaxMattersPrimaryContact,
} = require('../business/entities/contacts/PartnershipOtherThanTaxMattersContact');
const {
  getPetitionerConservatorContact,
} = require('../business/entities/contacts/PetitionerConservatorContact');
const {
  getPetitionerCorporationContact,
} = require('../business/entities/contacts/PetitionerCorporationContact');
const {
  getPetitionerCustodianContact,
} = require('../business/entities/contacts/PetitionerCustodianContact');
const {
  getPetitionerDeceasedSpouseContact,
} = require('../business/entities/contacts/PetitionerDeceasedSpouseContact');
const {
  getPetitionerEstateWithExecutorPrimaryContact,
} = require('../business/entities/contacts/PetitionerEstateWithExecutorPrimaryContact');
const {
  getPetitionerGuardianContact,
} = require('../business/entities/contacts/PetitionerGuardianContact');
const {
  getPetitionerIntermediaryContact,
} = require('../business/entities/contacts/PetitionerIntermediaryContact');
const {
  getPetitionerPrimaryContact,
} = require('../business/entities/contacts/PetitionerPrimaryContact');
const {
  getPetitionerSpouseContact,
} = require('../business/entities/contacts/PetitionerSpouseContact');
const {
  getPetitionerTrustContact,
} = require('../business/entities/contacts/PetitionerTrustContact');
const {
  getSurvivingSpouseContact,
} = require('../business/entities/contacts/SurvivingSpouseContact');
const {
  InitialWorkItemMessage,
} = require('../business/entities/InitialWorkItemMessage');
const {
  OrderWithoutBody,
} = require('../business/entities/orders/OrderWithoutBody');
const {
  PrivatePractitioner,
} = require('../business/entities/PrivatePractitioner');
const { Batch } = require('../business/entities/Batch');
const { Case } = require('../business/entities/cases/Case');
const { CaseDeadline } = require('../business/entities/CaseDeadline');
const { CaseMessage } = require('../business/entities/CaseMessage');
const { Correspondence } = require('../business/entities/Correspondence');
const { COUNTRY_TYPES } = require('../business/entities/EntityConstants');
const { DocketRecord } = require('../business/entities/DocketRecord');
const { Document } = require('../business/entities/Document');
const { ForwardMessage } = require('../business/entities/ForwardMessage');
const { IrsPractitioner } = require('../business/entities/IrsPractitioner');
const { Message } = require('../business/entities/Message');
const { NewCaseMessage } = require('../business/entities/NewCaseMessage');
const { NewPractitioner } = require('../business/entities/NewPractitioner');
const { Note } = require('../business/entities/notes/Note');
const { Order } = require('../business/entities/orders/Order');
const { PARTY_TYPES } = require('../business/entities/EntityConstants');
const { Practitioner } = require('../business/entities/Practitioner');
const { PublicUser } = require('../business/entities/PublicUser');
const { Scan } = require('../business/entities/Scan');
const { Statistic } = require('../business/entities/Statistic');
const { User } = require('../business/entities/User');
const { UserCase } = require('../business/entities/UserCase');
const { UserCaseNote } = require('../business/entities/notes/UserCaseNote');
const { WorkItem } = require('../business/entities/WorkItem');

let contactMapping = '# Party Type Contact Type Mappings\n';

for (const partyType in PARTY_TYPES) {
  const constructors = ContactFactory.getContactConstructors({
    partyType: PARTY_TYPES[partyType],
  });

  contactMapping += `### ${partyType}\n\nPrimary contact: ${constructors.primary.contactName}\n\n`;
  if (constructors.secondary) {
    contactMapping += `Secondary contact: ${constructors.secondary.contactName}\n\n`;
  }
  if (constructors.otherFilers) {
    contactMapping += `Other filers contact: ${constructors.otherFilers.contactName}\n\n`;
  }
  if (constructors.otherPetitioners) {
    contactMapping += `Other petitioners contact: ${constructors.otherPetitioners.contactName}\n\n`;
  }
}

fs.writeFileSync('./docs/entities/ContactMapping.md', contactMapping);

const generateMarkdownSchema = (entity, entityName) => {
  const json = entity.getSchema().describe();

  fs.writeFileSync(
    `./docs/entities/${entityName}.md`,
    '# ' + entityName + '\n ```\n' + json2yaml.stringify(json) + '\n ```\n',
  );
};

generateMarkdownSchema(
  getNextFriendForIncompetentPersonContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/NextFriendForIncompetentPersonContact',
);

generateMarkdownSchema(
  getNextFriendForMinorContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/NextFriendForMinorContact',
);

generateMarkdownSchema(
  getPartnershipAsTaxMattersPartnerPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PartnershipAsTaxMattersPartnerContact',
);

generateMarkdownSchema(
  getPartnershipBBAPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PartnershipBBAPrimaryContact',
);

generateMarkdownSchema(
  getPartnershipOtherThanTaxMattersPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PartnershipOtherThanTaxMattersPrimaryContact',
);

generateMarkdownSchema(
  getPetitionerConservatorContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerConservatorContact',
);

generateMarkdownSchema(
  getPetitionerCorporationContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerCorporationContact',
);

generateMarkdownSchema(
  getPetitionerCustodianContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerCustodianContact',
);

generateMarkdownSchema(
  getPetitionerDeceasedSpouseContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerDeceasedSpouseContact',
);

generateMarkdownSchema(
  getPetitionerEstateWithExecutorPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerEstateWithExecutorPrimaryContact',
);

generateMarkdownSchema(
  getPetitionerGuardianContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerGuardianContact',
);

generateMarkdownSchema(
  getPetitionerIntermediaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerIntermediaryContact',
);

generateMarkdownSchema(
  getPetitionerPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerPrimaryContact',
);

generateMarkdownSchema(
  getPetitionerSpouseContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerSpouseContact',
);

generateMarkdownSchema(
  getPetitionerTrustContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerTrustContact',
);

generateMarkdownSchema(
  getSurvivingSpouseContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/SurvivingSpouseContact',
);

generateMarkdownSchema(
  getOtherFilerContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/OtherFilerContact',
);

generateMarkdownSchema(Batch, 'Batch');
generateMarkdownSchema(Case, 'Case');
generateMarkdownSchema(CaseDeadline, 'CaseDeadline');
generateMarkdownSchema(CaseMessage, 'CaseMessage');
generateMarkdownSchema(Correspondence, 'Correspondence');
generateMarkdownSchema(DocketRecord, 'DocketRecord');
generateMarkdownSchema(Document, 'Document');
generateMarkdownSchema(ForwardMessage, 'ForwardMessage');
generateMarkdownSchema(InitialWorkItemMessage, 'InitialWorkItemMessage');
generateMarkdownSchema(IrsPractitioner, 'IrsPractitioner');
generateMarkdownSchema(Message, 'Message');
generateMarkdownSchema(NewCaseMessage, 'NewCaseMessage');
generateMarkdownSchema(NewPractitioner, 'NewPractitioner');
generateMarkdownSchema(Note, 'Note');
generateMarkdownSchema(Order, 'Order');
generateMarkdownSchema(OrderWithoutBody, 'OrderWithoutBody');
generateMarkdownSchema(Practitioner, 'Practitioner');
generateMarkdownSchema(PrivatePractitioner, 'PrivatePractitioner');
generateMarkdownSchema(PublicUser, 'PublicUser');
generateMarkdownSchema(Scan, 'Scan');
generateMarkdownSchema(Statistic, 'Statistic');
generateMarkdownSchema(User, 'User');
generateMarkdownSchema(UserCase, 'UserCase');
generateMarkdownSchema(UserCaseNote, 'UserCaseNote');
generateMarkdownSchema(WorkItem, 'WorkItem');
