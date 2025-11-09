import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { WrappedRegistryReferenceTypesContainer } from 'modules/admin';

const RegistryReferenceTypes = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <WrappedRegistryReferenceTypesContainer />
            </AnalyticsProvider>
    </SWRConfig>
);

export default RegistryReferenceTypes;
