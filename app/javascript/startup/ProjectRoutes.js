import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { default as ProjectRoutesComponent } from 'modules/routes/ProjectRoutes.js';

const ProjectRoutes = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <BrowserRouter>
                <ThemeProvider />
                <ProjectRoutesComponent />
            </BrowserRouter>
        </Provider>
    </SWRConfig>
);

export default ProjectRoutes;
