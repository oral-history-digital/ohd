import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import TranslationValues from 'startup/TranslationValues.js';
import store from 'startup/store.js';


ReactOnRails.registerStore({ store });
ReactOnRails.register({
    Sidebar,
    TranslationValues,
});



