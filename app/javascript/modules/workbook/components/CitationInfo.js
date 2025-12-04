import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { CopyText } from 'modules/ui';
import PropTypes from 'prop-types';

import interviewCitation from '../interviewCitation';

export default function CitationInfo({
    interview,
    project,
    tape /* optional */,
    time /* optional */,
    className,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const citationStr = interviewCitation(
        interview,
        project,
        pathBase,
        tape,
        time,
        { t, locale }
    );

    return (
        <section className={className}>
            <h4 className="u-line-height u-mt-none u-mb-none">
                {t('modules.workbook.citation')}
            </h4>
            {citationStr}{' '}
            <CopyText
                iconClassName="Icon--primary"
                text={citationStr}
                title={t('modules.workbook.copy_citation')}
            />
        </section>
    );
}

CitationInfo.propTypes = {
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    tape: PropTypes.number,
    time: PropTypes.number,
    className: PropTypes.string,
};
