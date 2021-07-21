import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { RouteDivider } from 'modules/routes';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';

const App = (props) => (
    <Provider store={archiveStore(props)}>
        <ThemeProvider />
        <BrowserRouter>
            <RouteDivider />
        </BrowserRouter>
    </Provider>
);

export default App;
