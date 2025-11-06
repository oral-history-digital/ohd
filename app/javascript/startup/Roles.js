import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { WrappedRolesContainer } from 'modules/admin';

const Roles = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <WrappedRolesContainer />
        </Provider>
    </SWRConfig>
);

export default Roles;
