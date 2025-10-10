import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { HelpTextAdminPage } from 'modules/admin';

const HelpTextAdmin = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <HelpTextAdminPage />
        </Provider>
    </SWRConfig>
);

export default HelpTextAdmin;
