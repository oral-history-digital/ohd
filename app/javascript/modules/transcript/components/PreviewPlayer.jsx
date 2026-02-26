import { useI18n } from 'modules/i18n';
import { formatTimecode, timecodeToSeconds } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaPlay, FaStop } from 'react-icons/fa';

import { useSegmentPreview } from '../hooks';

export default function PreviewPlayer({ segment, nextSegmentTimecode }) {
    const { t } = useI18n();

    const { isPreviewPlaying, togglePreview, currentTime } = useSegmentPreview(
        segment,
        nextSegmentTimecode
    );

    // Show live time during playback, otherwise show the segment start
    const displayTime = isPreviewPlaying
        ? currentTime
        : timecodeToSeconds(segment.timecode);

    const formatTime = (seconds) =>
        formatTimecode(seconds ?? 0, false, false, false);

    const formattedTime = formatTime(displayTime);

    const formattedEndTime = nextSegmentTimecode
        ? formatTime(timecodeToSeconds(nextSegmentTimecode))
        : null;

    return (
        <div className="SegmentTabs-preview">
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                onClick={togglePreview}
                title={t(
                    isPreviewPlaying
                        ? 'edit.segment.preview_stop'
                        : 'edit.segment.preview_play'
                )}
                aria-label={t(
                    isPreviewPlaying
                        ? 'edit.segment.preview_stop'
                        : 'edit.segment.preview_play'
                )}
                aria-pressed={isPreviewPlaying}
            >
                {isPreviewPlaying ? <FaStop /> : <FaPlay />}
            </button>
            <span className="SegmentTabs-previewTime">
                <span className="SegmentTabs-previewCurrent">
                    {formattedTime}
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
