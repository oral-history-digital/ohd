import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { Sidebar as SidebarComponent } from 'modules/sidebar';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';

const Sidebar = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <SidebarComponent />
        </Provider>
    </SWRConfig>
);

export default Sidebar;

