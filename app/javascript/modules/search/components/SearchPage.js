import { useTrackPageView } from 'modules/analytics';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { Helmet } from 'react-helmet';

import useTrackArchiveSearch from '../useTrackArchiveSearch';
import ArchiveSearch from './ArchiveSearch';

export default function SearchPage() {
    const { t } = useI18n();
    useTrackPageView();
    useTrackArchiveSearch();

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('interviews')}</title>
            </Helmet>
            <div className="wrapper-content interviews">
                <ErrorBoundary>
                    <ArchiveSearch />
                </ErrorBoundary>
            </div>
        </ScrollToTop>
    );
}
