import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import { ScrollToTop } from 'modules/user-agent';
import { useI18n } from 'modules/i18n';
import { INDEX_SEARCH, setSidebarTabsIndex } from 'modules/sidebar';
import ArchiveSearch from './ArchiveSearch';

export default function SearchPage() {
    const { t } = useI18n();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSidebarTabsIndex(INDEX_SEARCH));
    }, []);

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('interviews')}</title>
            </Helmet>
            <div className="wrapper-content interviews">
                <ArchiveSearch />
            </div>
        </ScrollToTop>
    );
}
