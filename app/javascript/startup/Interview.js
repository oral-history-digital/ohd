import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import { InterviewContainer } from 'modules/interview';
import { LayoutContainer} from 'modules/layout';
import { AnalyticsProvider } from 'modules/analytics';

const Interview = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
        <AnalyticsProvider>
            <LayoutContainer scrollPositionBelowThreshold={false} />
            <InterviewContainer />
        </AnalyticsProvider>
    </SWRConfig>
);

export default Interview;
