import { useI18n } from 'modules/i18n';
import {
    detectTimecodeFormat,
    formatTimecode,
    timecodeToSeconds,
} from 'modules/utils';
import PropTypes from 'prop-types';
import {
    FaBackward,
    FaForward,
    FaPause,
    FaPlay,
    FaStepBackward,
} from 'react-icons/fa';

import { useSegmentPreview } from '../hooks';

export default function PreviewPlayer({ segment, nextSegmentTimecode }) {
    const { t } = useI18n();

    const {
        isPreviewPlaying,
        togglePlayPause,
        seekToStart,
        seekBy,
        currentTime,
    } = useSegmentPreview(segment, nextSegmentTimecode);

    const timeCodeFormat = detectTimecodeFormat(segment.timecode) ?? 'ms';

    const segmentStartTime = timecodeToSeconds(segment.timecode);

    const skipBackDisabled = currentTime < segmentStartTime + 0.5;
    const skipBackStepDisabled = currentTime < segmentStartTime + 5;
    const skipForwardStepDisabled =
        nextSegmentTimecode == null ||
        currentTime > timecodeToSeconds(nextSegmentTimecode) - 5;

    const formatTime = (seconds, which) =>
        isPreviewPlaying && which === 'start'
            ? formatTimecode(seconds ?? 0, false, false, false) // Don't show milliseconds for live time to avoid jitter
            : formatTimecode(seconds ?? 0, false, true, false, timeCodeFormat);

    const formattedStartTime = formatTime(currentTime, 'start');

    const formattedEndTime = nextSegmentTimecode
        ? formatTime(timecodeToSeconds(nextSegmentTimecode), 'end')
        : null;

    return (
        <div className="SegmentTabs-preview">
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                onClick={togglePlayPause}
                title={t(
                    isPreviewPlaying
                        ? 'edit.segment.preview_pause'
                        : 'edit.segment.preview_play'
                )}
                aria-label={t(
                    isPreviewPlaying
                        ? 'edit.segment.preview_pause'
                        : 'edit.segment.preview_play'
                )}
                aria-pressed={isPreviewPlaying}
            >
                {isPreviewPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                onClick={seekToStart}
                title={t('edit.segment.preview_restart')}
                aria-label={t('edit.segment.preview_restart')}
                disabled={skipBackDisabled}
            >
                <FaStepBackward />
            </button>
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                onClick={() => seekBy(-3)}
                title={t('edit.segment.preview_back_3')}
                aria-label={t('edit.segment.preview_back_3')}
                disabled={skipBackStepDisabled}
            >
                <FaBackward />
            </button>
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                onClick={() => seekBy(3)}
                title={t('edit.segment.preview_forward_3')}
                aria-label={t('edit.segment.preview_forward_3')}
                disabled={skipForwardStepDisabled}
            >
                <FaForward />
            </button>
            <span className="SegmentTabs-previewTime">
                <span className="SegmentTabs-previewCurrent">
                    {formattedStartTime}
                </span>
                {nextSegmentTimecode && (
                    <>
                        <span className="SegmentTabs-previewSeparator">
                            {' – '}
                        </span>
                        <span className="SegmentTabs-previewEnd">
                            {formattedEndTime}
                        </span>
                    </>
                )}
            </span>
        </div>
    );
}

PreviewPlayer.propTypes = {
    segment: PropTypes.object.isRequired,
    nextSegmentTimecode: PropTypes.string,
};
