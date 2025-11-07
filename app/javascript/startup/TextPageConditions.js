import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { LayoutContainer } from 'modules/layout';

import { AnalyticsProvider } from 'modules/analytics';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { TextPage } from 'modules/layout';

const TextPageConditions = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <AnalyticsProvider>
                <LayoutContainer scrollPositionBelowThreshold={false} />
                <TextPage code='conditions' />
            </AnalyticsProvider>
        </Provider>
    </SWRConfig>
);

export default TextPageConditions;
