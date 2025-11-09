import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import TextPageContact from 'startup/TextPageContact.js';
import TextPageLegalInfo from 'startup/TextPageLegalInfo.js';
import TextPageConditions from 'startup/TextPageConditions.js';
import TextPageOhdConditions from 'startup/TextPageOhdConditions.js';
import TextPagePrivacyProtection from 'startup/TextPagePrivacyProtection.js';
import store from 'startup/store.js';


ReactOnRails.registerStore({ store });
ReactOnRails.register({
    Sidebar,
    TextPageContact,
    TextPageLegalInfo,
    TextPageConditions,
    TextPageOhdConditions,
    TextPagePrivacyProtection,
});




