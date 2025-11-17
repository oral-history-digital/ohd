//import 'core-js/stable';
//import 'regenerator-runtime/runtime';
//import 'intersection-observer';
//import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import Interview from 'startup/Interview.js';
import EditInterview from 'startup/EditInterview.js';
import MediaComponent from 'startup/MediaComponent.js';
import archiveStore from 'startup/archiveStore.js';

ReactOnRails.registerStore({ archiveStore });

ReactOnRails.register({
    Sidebar,
    Interview,
    EditInterview,
    MediaComponent
});

