import { useI18n } from 'modules/i18n';
import {
    detectTimecodeFormat,
    formatTimecode,
    timecodeToSeconds,
} from 'modules/utils';
import PropTypes from 'prop-types';

export default function Timecode({ segment }) {
    const { t } = useI18n();

    if (!segment.timecode) return null;

    const secs = timecodeToSeconds(segment.timecode);
    const fmt = detectTimecodeFormat(segment.timecode) ?? 'ms';
    const tapeNumber = segment.tape_nbr;
    const hoverTitle =
        formatTimecode(secs, false, true, false, fmt) +
        ` (${t('tape')} ${tapeNumber})`;

    return (
        <div
            className="Segment-timecode"
            title={hoverTitle}
            aria-label={hoverTitle}
        >
            {formatTimecode(secs, false, false, true, fmt)}
            {tapeNumber && tapeNumber > 1 && (
                <span className="Tape-number"> ({tapeNumber})</span>
            )}
        </div>
    );
}

Timecode.propTypes = {
    segment: PropTypes.object.isRequired,
};
