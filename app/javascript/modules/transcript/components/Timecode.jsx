import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import PropTypes from 'prop-types';

export default function Timecode({ segment }) {
    const { t } = useI18n();

    if (!segment.time) return null;

    const tapeNumber = segment.tape_nbr;
    const hoverTitle =
        formatTimecode(segment.time, false, true, false) +
        ` (${t('tape')} ${tapeNumber})`;

    return (
        <div
            className="Segment-timecode"
            title={hoverTitle}
            aria-label={hoverTitle}
        >
            {formatTimecode(segment.time, false, false, true)}
            {tapeNumber && tapeNumber > 1 && (
                <span className="Tape-number"> ({tapeNumber})</span>
            )}
        </div>
    );
}

Timecode.propTypes = {
    segment: PropTypes.object.isRequired,
};
