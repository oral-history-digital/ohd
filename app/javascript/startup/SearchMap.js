import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { SearchMap as SearchMapComponent } from 'modules/search-map';
import ReactOnRails from 'react-on-rails';

const SearchMap = () => {
    const store = ReactOnRails.getStore('store');
    
    return (
        <Provider store={store}>
            <SWRConfig value={{ fetcher }}>
                <ThemeProvider />
                <AnalyticsProvider>
                    <LayoutContainer scrollPositionBelowThreshold={false} />
                <SearchMapComponent />
                </AnalyticsProvider>
            </SWRConfig>
        </Provider>
    );
};

export default SearchMap;
