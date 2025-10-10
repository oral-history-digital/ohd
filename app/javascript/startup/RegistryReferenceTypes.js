import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { WrappedRegistryReferenceTypesContainer } from 'modules/admin';

const RegistryReferenceTypes = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <WrappedRegistryReferenceTypesContainer />
        </Provider>
    </SWRConfig>
);

export default RegistryReferenceTypes;
