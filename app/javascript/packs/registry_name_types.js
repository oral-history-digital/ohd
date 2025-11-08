import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import WrappedRegistryNameTypesContainer from 'startup/WrappedRegistryNameTypesContainer.js';

ReactOnRails.register({
    Sidebar,
    WrappedRegistryNameTypesContainer,
});



