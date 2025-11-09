import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';

import EditProjectInfo from 'startup/EditProjectInfo.js';
import EditProjectConfig from 'startup/EditProjectConfig.js';
import EditProjectAccessConfig from 'startup/EditProjectAccessConfig.js';
import EditProjectDisplay from 'startup/EditProjectDisplay.js';
import ArchivePage from 'startup/ArchivePage.js';
import SiteStartpage from 'startup/SiteStartpage.js';
import Home from 'startup/Home.js';
import store from 'startup/store.js';


ReactOnRails.registerStore({ store });
ReactOnRails.register({
    EditProjectInfo,
    EditProjectConfig,
    EditProjectAccessConfig,
    EditProjectDisplay,
    ArchivePage,
    SiteStartpage,
    Home,
});
