import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { CollectionCatalogPage } from 'modules/catalog';

const CollectionCatalog = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <CollectionCatalogPage />
            </AnalyticsProvider>
        </Provider>
    </SWRConfig>
);

export default CollectionCatalog;
