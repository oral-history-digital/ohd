import { useState } from 'react';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import { RouteDivider } from 'modules/routes';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'stylesheets/main.scss';
import { SWRConfig } from 'swr';

import archiveStore from './archiveStore';

const App = (props) => {
    // useState initializer runs only once on mount, never on re-renders or
    // React Fast Refresh hot updates. Without this, archiveStore(props) was
    // called on every render, leaking a new Redux store (with all its
    // middleware subscriptions) each time a file was saved.
    const [store] = useState(() => archiveStore(props));

    return (
        <SWRConfig value={{ fetcher }}>
            <Provider store={store}>
                <BrowserRouter>
                    <ThemeProvider />
                    <RouteDivider />
                </BrowserRouter>
            </Provider>
        </SWRConfig>
    );
};

export default App;
