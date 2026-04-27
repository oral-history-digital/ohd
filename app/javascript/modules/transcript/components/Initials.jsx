import classNames from 'classnames';
import { useIsEditor } from 'modules/archive';
import PropTypes from 'prop-types';

export default function Initials({ contributor, segment }) {
    const isEditviewActive = useIsEditor();

    // If the speaker ID hasn't changed, do not render initials.
    if (!segment?.speakerIdChanged) return null;

    // If not in edit view and segment has no speaker, do not render initials.
    if (!isEditviewActive && !contributor?.initials && !segment?.speaker)
        return null;

    const initials = contributor?.initials || segment?.speaker || '?';
    const title = contributor?.fullname || segment?.speaker || '';

    const cls = classNames(
        'Segment-initials',
        segment?.speaker_is_interviewee
            ? 'Segment-initials--primary'
            : 'Segment-initials--secondary'
    );

    return (
        <span
            className={cls}
            title={title}
            aria-label={title}
            data-testid="segment-initials"
        >
            {initials}
        </span>
    );
}

Initials.propTypes = {
    contributor: PropTypes.object,
    segment: PropTypes.object.isRequired,
};
