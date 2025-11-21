//import 'core-js/stable';
//import 'regenerator-runtime/runtime';
//import 'intersection-observer';
//import 'datalist-polyfill';

// Importing Turbo, Stimulus and registering SegmentPopupController
import "@hotwired/turbo-rails"
import { Application } from "@hotwired/stimulus";
import SegmentPopupController from "controllers/segment_popup_controller";
const application = Application.start();
application.register("segment-popup", SegmentPopupController);

// Importing React components and store, and registering them with ReactOnRails
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

