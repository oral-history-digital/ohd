import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { WrappedContributionTypesContainer } from 'modules/admin';

const ContributionTypes = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <WrappedContributionTypesContainer />
            </AnalyticsProvider>
    </SWRConfig>
);

export default ContributionTypes;
