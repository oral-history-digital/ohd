import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { EditProjectDisplay as EditProjectDisplayComponent } from 'modules/admin';

const EditProjectDisplay = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <EditProjectDisplayComponent />
        </Provider>
    </SWRConfig>
);

export default EditProjectDisplay;
