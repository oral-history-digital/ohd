import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'

import archiveStore from '../store/archiveStore';
import { RouteDivider } from 'modules/routes';

import 'stylesheets/main.scss';

const App = (props) => (
    <Provider store={archiveStore(props)}>
        <BrowserRouter>
            <RouteDivider />
        </BrowserRouter>
    </Provider>
);

export default App;
