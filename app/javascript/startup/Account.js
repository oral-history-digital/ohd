import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { AccountPage } from 'modules/user';
import ReactOnRails from 'react-on-rails';

const Account = () => {
    const store = ReactOnRails.getStore('store');
    
    return (
        <Provider store={store}>
            <SWRConfig value={{ fetcher }}>
                <ThemeProvider />
                <AnalyticsProvider>
                    <LayoutContainer scrollPositionBelowThreshold={false} />
                    <AccountPage />
                </AnalyticsProvider>
            </SWRConfig>
        </Provider>
    );
};

export default Account;
