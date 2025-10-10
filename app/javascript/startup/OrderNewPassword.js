import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { OrderNewPasswordContainer } from 'modules/user';

const OrderNewPassword = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <OrderNewPasswordContainer />
        </Provider>
    </SWRConfig>
);

export default OrderNewPassword;
