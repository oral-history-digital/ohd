import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { WrappedRegistryNameTypesContainer } from 'modules/admin';

const RegistryNameTypes = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <WrappedRegistryNameTypesContainer />
        </Provider>
    </SWRConfig>
);

export default RegistryNameTypes;
