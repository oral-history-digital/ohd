import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import RegistryReferenceTypes from 'startup/RegistryReferenceTypes.js';

ReactOnRails.register({
    Sidebar,
    RegistryReferenceTypes,
});



