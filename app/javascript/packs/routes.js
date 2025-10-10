import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';

import NotFoundPage from 'startup/NotFoundPage.js';
import SiteStartpage from 'startup/SiteStartpage.js';
import ArchivePage from 'startup/ArchivePage.js';
import Institutions from 'startup/Institutions.js';
import HelpTextAdmin from 'startup/HelpTextAdmin.js';
import Home from 'startup/Home.js';

ReactOnRails.register({
    NotFoundPage,
    SiteStartpage,
    ArchivePage,
    Institutions,
    HelpTextAdmin,
    Home,
});
