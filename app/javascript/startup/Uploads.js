import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { UploadsPage } from 'modules/admin';
import ReactOnRails from 'react-on-rails';

const Uploads = () => {
    const archiveStore = ReactOnRails.getStore('archiveStore');
    
    return (
        <Provider store={archiveStore}>
            <SWRConfig value={{ fetcher }}>
                <ThemeProvider />
                <AnalyticsProvider>
                    <LayoutContainer scrollPositionBelowThreshold={false} />
                    <UploadsPage />
                </AnalyticsProvider>
            </SWRConfig>
        </Provider>
    );
};

export default Uploads;
