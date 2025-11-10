import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { SiteStartpage as SiteStartpageComponent } from 'modules/site-startpage';
import ReactOnRails from 'react-on-rails';

const SiteStartpage = () => {
    const archiveStore = ReactOnRails.getStore('archiveStore');
    
    return (
        <Provider store={archiveStore}>
            <SWRConfig value={{ fetcher }}>
                <ThemeProvider />
                <AnalyticsProvider>
                    <LayoutContainer scrollPositionBelowThreshold={false} />
                <SiteStartpageComponent />
                </AnalyticsProvider>
            </SWRConfig>
        </Provider>
    );
};

export default SiteStartpage;
