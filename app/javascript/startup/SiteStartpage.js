import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { SiteStartpage as SiteStartpageComponent } from 'modules/site-startpage';

const SiteStartpage = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <SiteStartpageComponent />
            </AnalyticsProvider>
    </SWRConfig>
);

export default SiteStartpage;
