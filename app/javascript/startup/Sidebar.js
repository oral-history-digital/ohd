import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { Sidebar as SidebarComponent } from 'modules/sidebar';
import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import 'stylesheets/main.scss';
import ReactOnRails from 'react-on-rails';

const Sidebar = () => {
    const store = ReactOnRails.getStore('store');
    
    return (
        <Provider store={store}>
            <SWRConfig value={{ fetcher }}>
                <ThemeProvider />
                <SidebarComponent />
            </SWRConfig>
        </Provider>
    );
};

export default Sidebar;

