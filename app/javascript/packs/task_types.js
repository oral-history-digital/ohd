import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import WrappedTaskTypesContainer from 'startup/WrappedTaskTypesContainer.js';

ReactOnRails.register({
    Sidebar,
    WrappedTaskTypesContainer,
});



