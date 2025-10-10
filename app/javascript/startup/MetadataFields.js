import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { MetadataFieldsContainer } from 'modules/admin';

const MetadataFields = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <MetadataFieldsContainer />
        </Provider>
    </SWRConfig>
);

export default MetadataFields;
