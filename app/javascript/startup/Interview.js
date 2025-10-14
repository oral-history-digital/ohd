import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';

//import { AnalyticsProvider } from 'modules/analytics';
            //<AnalyticsProvider project={project}>
            //</AnalyticsProvider>
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { InterviewContainer } from 'modules/interview';

const Interview = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
                <LayoutContainer scrollPositionBelowThreshold={useScrollBelowThreshold()}>
                    <InterviewContainer />
                </LayoutContainer>
        </Provider>
    </SWRConfig>
);

export default Interview;
