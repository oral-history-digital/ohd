import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { ActivateAccount as ActivateAccountComponent } from 'modules/user';

const ActivateAccount = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <ActivateAccountComponent />
        </Provider>
    </SWRConfig>
);

export default ActivateAccount;
