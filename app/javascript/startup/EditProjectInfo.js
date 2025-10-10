import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { EditProjectInfo as EditProjectInfoComponent } from 'modules/admin';

const EditProjectInfo = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <EditProjectInfoComponent />
        </Provider>
    </SWRConfig>
);

export default EditProjectInfo;
