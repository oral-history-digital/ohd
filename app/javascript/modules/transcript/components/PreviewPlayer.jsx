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

    const skipBackDisabled = currentTime <= segmentStartTime + 0.1;
    const skipBackStepDisabled = currentTime < segmentStartTime + 5;
    const skipForwardStepDisabled =
        nextSegmentTimecode == null ||
        currentTime > timecodeToSeconds(nextSegmentTimecode) - 5;

    // When the media is at (or snapped near) the segment start, display the
    // exact parsed timecode rather than the media element's reported position,
    // which may differ by up to one frame due to keyframe snapping.
    // Elsewhere show the actual position; when playing omit sub-seconds to avoid jitter.
    const ONE_FRAME = 1 / 25;
    const displayTime =
        Math.abs(currentTime - segmentStartTime) < ONE_FRAME
            ? segmentStartTime
            : currentTime;
    const formattedStartTime = isPreviewPlaying
        ? formatTimecode(displayTime, false, false, false)
        : formatTimecode(displayTime, false, true, false, timeCodeFormat);

    const formattedEndTime = nextSegmentTimecode
        ? formatTimecode(
              timecodeToSeconds(nextSegmentTimecode),
              false,
              true,
              false,
              timeCodeFormat
          )
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
