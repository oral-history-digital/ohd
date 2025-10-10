import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { CollectionCatalogPage } from 'modules/catalog';

const CollectionCatalog = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <CollectionCatalogPage />
        </Provider>
    </SWRConfig>
);

export default CollectionCatalog;
