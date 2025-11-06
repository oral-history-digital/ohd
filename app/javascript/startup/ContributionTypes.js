import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { ThemeProvider } from 'modules/layout';
import archiveStore from './archiveStore';
import 'stylesheets/main.scss';
import { WrappedContributionTypesContainer } from 'modules/admin';

const ContributionTypes = (props) => (
    <SWRConfig value={{ fetcher }}>
        <Provider store={archiveStore(props)}>
            <ThemeProvider />
            <WrappedContributionTypesContainer />
        </Provider>
    </SWRConfig>
);

export default ContributionTypes;
