import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';

import EditInterview from 'startup/EditInterview.js';
import Interview from 'startup/Interview.js';
import Search from 'startup/Search.js';
import SearchMap from 'startup/SearchMap.js';
import Registry from 'startup/Registry.js';
import Account from 'startup/Account.js';
import OrderNewPassword from 'startup/OrderNewPassword.js';
import ActivateAccount from 'startup/ActivateAccount.js';
import UsersAdmin from 'startup/UsersAdmin.js';
import Uploads from 'startup/Uploads.js';
import EditProjectInfo from 'startup/EditProjectInfo.js';
import EditProjectConfig from 'startup/EditProjectConfig.js';
import EditProjectAccessConfig from 'startup/EditProjectAccessConfig.js';
import EditProjectDisplay from 'startup/EditProjectDisplay.js';
import MetadataFields from 'startup/MetadataFields.js';
import PeopleAdmin from 'startup/PeopleAdmin.js';
import EventTypesAdmin from 'startup/EventTypesAdmin.js';
import RegistryReferenceTypes from 'startup/RegistryReferenceTypes.js';
import RegistryNameTypes from 'startup/RegistryNameTypes.js';
import ContributionTypes from 'startup/ContributionTypes.js';
import Languages from 'startup/Languages.js';
import TranslationValues from 'startup/TranslationValues.js';
import TextPageConditions from 'startup/TextPageConditions.js';
import TextPageOhdConditions from 'startup/TextPageOhdConditions.js';
import TextPagePrivacyProtection from 'startup/TextPagePrivacyProtection.js';
import TextPageContact from 'startup/TextPageContact.js';
import TextPageLegalInfo from 'startup/TextPageLegalInfo.js';
import Collections from 'startup/Collections.js';
import Roles from 'startup/Roles.js';
import Permissions from 'startup/Permissions.js';
import TaskTypes from 'startup/TaskTypes.js';

ReactOnRails.register({
    EditInterview,
    Interview,
    Search,
    SearchMap,
    Registry,
    Account,
    OrderNewPassword,
    ActivateAccount,
    UsersAdmin,
    Uploads,
    EditProjectInfo,
    EditProjectConfig,
    EditProjectAccessConfig,
    EditProjectDisplay,
    MetadataFields,
    PeopleAdmin,
    EventTypesAdmin,
    RegistryReferenceTypes,
    RegistryNameTypes,
    ContributionTypes,
    Languages,
    TranslationValues,
    TextPageConditions,
    TextPageOhdConditions,
    TextPagePrivacyProtection,
    TextPageContact,
    TextPageLegalInfo,
    Collections,
    Roles,
    Permissions,
    TaskTypes,
});
