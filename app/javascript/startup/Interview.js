import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { InterviewContainer } from 'modules/interview';
import { LayoutContainer} from 'modules/layout';
import { AnalyticsProvider } from 'modules/analytics';

const Interview = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <InterviewContainer />
            </AnalyticsProvider>
        </Provider>
    </SWRConfig>
);

export default Interview;
