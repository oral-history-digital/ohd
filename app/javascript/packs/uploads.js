import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import UploadsPage from 'startup/UploadsPage.js';

ReactOnRails.register({
    Sidebar,
    UploadsPage,
});



