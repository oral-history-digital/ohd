import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { default as NotFoundPageComponent } from 'modules/routes/NotFoundPage.js';

const NotFoundPage = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <NotFoundPageComponent />
            </AnalyticsProvider>
    </SWRConfig>
);

export default NotFoundPage;
