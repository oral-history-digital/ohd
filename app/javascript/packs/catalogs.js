import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';

import MainCatalog from 'startup/MainCatalog.js';
import InstitutionCatalog from 'startup/InstitutionCatalog.js';
import ArchiveCatalog from 'startup/ArchiveCatalog.js';
import CollectionCatalog from 'startup/CollectionCatalog.js';
import archiveStore from 'startup/archiveStore.js';


ReactOnRails.registerStore({ archiveStore });
ReactOnRails.register({
    MainCatalog,
    InstitutionCatalog,
    ArchiveCatalog,
    CollectionCatalog,
});
