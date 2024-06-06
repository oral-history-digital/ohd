import { Helmet } from 'react-helmet';

import { useTrackPageView } from 'modules/analytics';
import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { useI18n } from 'modules/i18n';
import { Fetch } from 'modules/data';
import MainCatalog from './MainCatalog';

export default function MainCatalogPage() {
    const { t } = useI18n();
    useTrackPageView();

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('modules.catalog.title')}</title>
            </Helmet>
            <ErrorBoundary>
                <div className="wrapper-content interviews">
                    <h1 className='search-results-title'>
                        {t('modules.catalog.title')}
                    </h1>
                    <Fetch
                        fetchParams={['institutions', null, null, 'all']}
                        testDataType='institutions'
                        testIdOrDesc='all'
                    >
                        <Fetch
                            fetchParams={['projects', null, null, 'all']}
                            testDataType='projects'
                            testIdOrDesc='all'
                        >
                            <Fetch
                                fetchParams={['collections', null, null, 'all']}
                                testDataType='collections'
                                testIdOrDesc='all'
                            >
                                <MainCatalog />
                            </Fetch>
                        </Fetch>
                    </Fetch>
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
