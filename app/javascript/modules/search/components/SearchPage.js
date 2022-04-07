import { Helmet } from 'react-helmet';

import { ScrollToTop } from 'modules/user-agent';
import { useI18n } from 'modules/i18n';
import MemoizedArchiveSearch from './ArchiveSearch';

export default function SearchPage() {
    const { t } = useI18n();

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('interviews')}</title>
            </Helmet>
            <div className="wrapper-content interviews">
                <MemoizedArchiveSearch />
            </div>
        </ScrollToTop>
    );
}
