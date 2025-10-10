import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { ArchivePage as ArchivePageComponent } from 'modules/admin';

const ArchivePage = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <ArchivePageComponent />
        </Provider>
    </SWRConfig>
);

export default ArchivePage;
