import { useI18n } from 'modules/i18n';
import { formatTimecode, timecodeToSeconds } from 'modules/utils';
import PropTypes from 'prop-types';

export default function Timecode({ segment }) {
    const { t } = useI18n();

    if (!segment.timecode) return null;

    const secs = timecodeToSeconds(segment.timecode);
    const tapeNumber = segment.tape_nbr;
    const hoverTitle =
        formatTimecode(secs, false, true) + ` (${t('tape')} ${tapeNumber})`;

    return (
        <div
            className="Segment-timecode"
            title={hoverTitle}
            aria-label={hoverTitle}
            data-testid="segment-timecode"
        >
            {formatTimecode(secs, false, false, true)}
            {tapeNumber && tapeNumber > 1 && (
                <span className="Tape-number"> ({tapeNumber})</span>
            )}
        </div>
    );
}

Timecode.propTypes = {
    segment: PropTypes.object.isRequired,
};
