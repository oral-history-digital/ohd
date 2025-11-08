import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';

import EditProjectInfo from 'startup/EditProjectInfo.js';
import EditProjectConfig from 'startup/EditProjectConfig.js';
import EditProjectAccessConfig from 'startup/EditProjectAccessConfig.js';
import EditProjectDisplay from 'startup/EditProjectDisplay.js';

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
