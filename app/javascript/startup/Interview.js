import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { Sidebar } from 'modules/sidebar';
import { LayoutContainer} from 'modules/layout';
                //<LayoutContainer scrollPositionBelowThreshold={false}>
                //</LayoutContainer>
//import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';
                //<LayoutContainer scrollPositionBelowThreshold={useScrollBelowThreshold()}>
                    //<Sidebar className="Layout-sidebar" />

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { InterviewContainer } from 'modules/interview';

const Interview = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false}>
                    <InterviewContainer />
                </LayoutContainer>
            </AnalyticsProvider>
        </Provider>
    </SWRConfig>
);

export default Interview;
