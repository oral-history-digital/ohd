import { Helmet } from 'react-helmet';

import { useTrackPageView } from 'modules/analytics';
import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { useI18n } from 'modules/i18n';
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
                    <MainCatalog />
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
