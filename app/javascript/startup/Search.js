import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { SearchPage } from 'modules/search';

const Search = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <SearchPage />
            </AnalyticsProvider>
    </SWRConfig>
);

export default Search;
