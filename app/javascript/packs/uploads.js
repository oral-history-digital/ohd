import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import Uploads from 'startup/Uploads.js';

ReactOnRails.register({
    Sidebar,
    Uploads,
});



