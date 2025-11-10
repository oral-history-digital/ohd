import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import HelpTextAdmin from 'startup/HelpTextAdmin.js';
import archiveStore from 'startup/archiveStore.js';


ReactOnRails.registerStore({ archiveStore });
ReactOnRails.register({
    Sidebar,
    HelpTextAdmin,
});




