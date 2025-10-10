import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { ArchiveCatalogPage } from 'modules/catalog';

const ArchiveCatalog = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <ArchiveCatalogPage />
        </Provider>
    </SWRConfig>
);

export default ArchiveCatalog;
