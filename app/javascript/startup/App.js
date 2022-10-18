import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { RouteDivider } from 'modules/routes';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';

const App = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <BrowserRouter>
                <RouteDivider />
            </BrowserRouter>
        </Provider>
    </SWRConfig>
);

export default App;
