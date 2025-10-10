import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { PeopleAdminPage } from 'modules/admin';

const PeopleAdmin = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <PeopleAdminPage />
        </Provider>
    </SWRConfig>
);

export default PeopleAdmin;
