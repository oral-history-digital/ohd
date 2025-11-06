import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { TextPage } from 'modules/layout';

const TextPagePrivacyProtection = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <TextPage code='privacy_protection' />
        </Provider>
    </SWRConfig>
);

export default TextPagePrivacyProtection;
