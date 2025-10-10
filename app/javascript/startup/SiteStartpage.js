import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { SiteStartpage as SiteStartpageComponent } from 'modules/site-startpage';

const SiteStartpage = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <SiteStartpageComponent />
        </Provider>
    </SWRConfig>
);

export default SiteStartpage;
