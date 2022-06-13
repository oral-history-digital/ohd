import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { useI18n } from 'modules/i18n';
import ArchiveSearch from './ArchiveSearch';

export default function SearchPage() {
    const { t } = useI18n();
    const dispatch = useDispatch();

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
