import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import { RouteDivider } from 'modules/routes';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'stylesheets/main.scss';
import { SWRConfig } from 'swr';

import archiveStore from './archiveStore';

const App = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <BrowserRouter>
                <ThemeProvider />
                <RouteDivider />
            </BrowserRouter>
        </Provider>
    </SWRConfig>
);

export default App;
