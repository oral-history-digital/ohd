import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import Interview from 'startup/Interview.js';
import EditInterview from 'startup/EditInterview.js';
import store from 'startup/store.js';

ReactOnRails.registerStore({ store });

ReactOnRails.register({
    Sidebar,
    Interview,
    EditInterview,
});

