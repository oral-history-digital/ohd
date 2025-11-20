import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { CopyText } from 'modules/ui';
import { formatTimecode } from 'modules/interview-helpers';

import interviewUrl from './interviewUrl';

export default function SegmentLink({ interviewId, tape, time, className }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const timecode = formatTimecode(time, true);

    const url = `${interviewUrl(pathBase, interviewId)}?tape=${tape}&time=${timecode}`;

    return (
        <section className={className}>
            <h4 className="u-line-height u-mt-none u-mb-none">
                {t('modules.workbook.segment_link')}
            </h4>
            {url} <CopyText className="Icon--primary" text={url} />
        </section>
    );
}

SegmentLink.propTypes = {
    interviewId: PropTypes.string.isRequired,
    tape: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    className: PropTypes.string,
};
