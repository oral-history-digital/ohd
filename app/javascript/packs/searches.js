import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';
import Sidebar from 'startup/Sidebar.js';
import Search from 'startup/Search.js';
import SearchMap from 'startup/SearchMap.js';
import archiveStore from 'startup/archiveStore.js';


ReactOnRails.registerStore({ archiveStore });
ReactOnRails.register({
    Sidebar,
    Search,
    SearchMap,
});


