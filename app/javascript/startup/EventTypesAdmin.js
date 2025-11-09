import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { EventTypesAdminPage } from 'modules/admin';

const EventTypesAdmin = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <EventTypesAdminPage />
            </AnalyticsProvider>
    </SWRConfig>
);

export default EventTypesAdmin;
