import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import PropTypes from 'prop-types';

export default function EditableTimecode({
    segment,
    editedTime,
    onTimeChange,
}) {
    const { t } = useI18n();
    const currentTime =
        editedTime !== null
            ? editedTime
            : formatTimecode(segment.time, false, true);

    // TODO: Add validation for timecode input format (HH:MM:SS.mmm)
    // TODO: Add validation for segment time boundaries in between adjacent segments

    return (
        <div className="EditableSegment-timecode">
            <label className="EditableSegment-timecodeLabel">
                {t('edit.segment.timecode')}:
            </label>
            <input
                type="text"
                className={classNames('EditableSegment-timecodeInput')}
                value={currentTime}
                onChange={(e) => onTimeChange(e.target.value)}
                placeholder="HH:MM:SS.mmm"
            />
        </div>
    );
}

EditableTimecode.propTypes = {
    segment: PropTypes.object.isRequired,
    editedTime: PropTypes.string,
    onTimeChange: PropTypes.func.isRequired,
};
