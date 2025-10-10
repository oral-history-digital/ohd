import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { InstitutionCatalogPage } from 'modules/catalog';

const InstitutionCatalog = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <InstitutionCatalogPage />
        </Provider>
    </SWRConfig>
);

export default InstitutionCatalog;
