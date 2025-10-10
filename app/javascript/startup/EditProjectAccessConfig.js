import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { EditProjectAccessConfig as EditProjectAccessConfigComponent } from 'modules/admin';

const EditProjectAccessConfig = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <EditProjectAccessConfigComponent />
        </Provider>
    </SWRConfig>
);

export default EditProjectAccessConfig;
