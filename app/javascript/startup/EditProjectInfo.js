import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { EditProjectInfo as EditProjectInfoComponent } from 'modules/admin';
import ReactOnRails from 'react-on-rails';

const EditProjectInfo = () => {
    const store = ReactOnRails.getStore('store');
    
    return (
        <Provider store={store}>
            <SWRConfig value={{ fetcher }}>
                <ThemeProvider />
                <AnalyticsProvider>
                    <LayoutContainer scrollPositionBelowThreshold={false} />
                <EditProjectInfoComponent />
                </AnalyticsProvider>
            </SWRConfig>
        </Provider>
    );
};

export default EditProjectInfo;
