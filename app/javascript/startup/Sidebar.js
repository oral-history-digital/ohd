import { SWRConfig } from 'swr';

import { Sidebar as SidebarComponent } from 'modules/sidebar';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';

const Sidebar = () => (
    <SWRConfig value={{ fetcher }}>
        <ThemeProvider />
        <SidebarComponent />
    </SWRConfig>
);

export default Sidebar;

