import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { MemoizedRoutesWithoutProjectId as RoutesWithoutProjectIdComponent } from 'modules/routes/Routes.js';

const RoutesWithoutProjectId = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <BrowserRouter>
                <ThemeProvider />
                <RoutesWithoutProjectIdComponent project={props.project} />
            </BrowserRouter>
        </Provider>
    </SWRConfig>
);

export default RoutesWithoutProjectId;
