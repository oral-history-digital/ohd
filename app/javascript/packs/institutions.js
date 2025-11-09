import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import Institutions from 'startup/Institutions.js';
import store from 'startup/store.js';


ReactOnRails.registerStore({ store });
ReactOnRails.register({
    Sidebar,
    Institutions,
});




