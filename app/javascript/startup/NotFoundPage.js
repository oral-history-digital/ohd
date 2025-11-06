import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { default as NotFoundPageComponent } from 'modules/routes/NotFoundPage.js';

const NotFoundPage = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <NotFoundPageComponent />
        </Provider>
    </SWRConfig>
);

export default NotFoundPage;
