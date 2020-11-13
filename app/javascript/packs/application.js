import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'intersection-observer';
import 'datalist-polyfill';
import ReactOnRails from 'react-on-rails';

import App from "../bundles/archive/startup/App";

ReactOnRails.register({
    App,
});
