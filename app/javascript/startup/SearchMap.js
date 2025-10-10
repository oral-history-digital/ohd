import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { SearchMap as SearchMapComponent } from 'modules/search-map';

const SearchMap = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <SearchMapComponent />
        </Provider>
    </SWRConfig>
);

export default SearchMap;
