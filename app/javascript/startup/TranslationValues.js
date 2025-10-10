import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { WrappedTranslationValuesContainer } from 'modules/admin';

const TranslationValues = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <WrappedTranslationValuesContainer />
        </Provider>
    </SWRConfig>
);

export default TranslationValues;
