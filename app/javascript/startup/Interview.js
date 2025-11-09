import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { InterviewContainer } from 'modules/interview';
import { LayoutContainer} from 'modules/layout';
import { AnalyticsProvider } from 'modules/analytics';
import ReactOnRails from 'react-on-rails';

const Interview = () => {
    const store = ReactOnRails.getStore('store');
    
    return (
        <Provider store={store}>
            <SWRConfig value={{ fetcher }}>
                <ThemeProvider />
                <AnalyticsProvider>
                    <LayoutContainer scrollPositionBelowThreshold={false} />
                    <InterviewContainer />
                </AnalyticsProvider>
            </SWRConfig>
        </Provider>
    );
};

export default Interview;
