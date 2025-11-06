import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { EditInterview as EditInterviewComponent } from 'modules/admin';

const EditInterview = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <EditInterviewComponent />
        </Provider>
    </SWRConfig>
);

export default EditInterview;
