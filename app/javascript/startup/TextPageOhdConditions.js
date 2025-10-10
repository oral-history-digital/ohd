import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { TextPage } from 'modules/layout';

const TextPageOhdConditions = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <TextPage code='ohd_conditions' />
        </Provider>
    </SWRConfig>
);

export default TextPageOhdConditions;
