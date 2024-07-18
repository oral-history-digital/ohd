import { useSelector } from 'react-redux';
import { FaDownload } from 'react-icons/fa';

import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function InterviewDownloads({
    lang,
    type,
    condition,
    showEmpty,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const interview = useSelector(getCurrentInterview);

    if (condition && lang) {
        return (
            <a
                href={`${pathBase}/interviews/${interview.archive_id}/${type}.pdf?lang=${lang}`}
                className="flyout-content-data"
                key={`${type}-${lang}`}
            >
                <FaDownload className="Icon Icon--small" title={t('download')} />
                {' '}
                {t(lang)}
            </a>
        )
    } else if (showEmpty) {
        return '---';
    } else {
        return null;
    }

}

