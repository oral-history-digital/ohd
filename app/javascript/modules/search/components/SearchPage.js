import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import { ScrollToTop } from 'modules/user-agent';
import { useI18n } from 'modules/i18n';
import MemoizedArchiveSearch from './ArchiveSearch';

export default function SearchPage() {
    const { t } = useI18n();

    /* search updates a lot with the same data, so we use a memoized component
       to prevent rerendering. */
    const { search } = useLocation();

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('interviews')}</title>
            </Helmet>
            <div className="wrapper-content interviews">
                <MemoizedArchiveSearch search={search} />
            </div>
        </ScrollToTop>
    );
}
