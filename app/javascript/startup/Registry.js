import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { RegistryContainer } from 'modules/registry';

const Registry = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <RegistryContainer />
        </Provider>
    </SWRConfig>
);

export default Registry;
