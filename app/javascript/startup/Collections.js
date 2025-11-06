import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { WrappedCollectionsContainer } from 'modules/admin';

const Collections = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <WrappedCollectionsContainer />
        </Provider>
    </SWRConfig>
);

export default Collections;
