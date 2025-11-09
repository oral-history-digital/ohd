import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { InstitutionCatalogPage } from 'modules/catalog';

const InstitutionCatalog = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <InstitutionCatalogPage />
            </AnalyticsProvider>
    </SWRConfig>
);

export default InstitutionCatalog;
