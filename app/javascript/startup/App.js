import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

import { RouteDivider } from 'modules/routes';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';

const queryClient = new QueryClient();

const App = (props) => (
    <QueryClientProvider client={queryClient}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <BrowserRouter>
                <RouteDivider />
            </BrowserRouter>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
);

export default App;
