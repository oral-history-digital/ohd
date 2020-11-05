import '../../../lib/polyfills';
import '@babel/polyfill';
import 'intersection-observer';
import 'datalist-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'

import archiveStore from '../store/archiveStore';
import LocaleRoute from '../components/routes/LocaleRoute';

import '../stylesheets/main.scss';

const App = (props) => (
    <Provider store={archiveStore(props)}>
        <BrowserRouter>
            <LocaleRoute />
        </BrowserRouter>
    </Provider>
);

export default App;
