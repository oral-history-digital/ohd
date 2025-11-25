import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function Initials({ contributor, segment }) {
    const initials = contributor?.initials || segment?.speaker || '?';
    const title = contributor?.fullname || segment?.speaker || '';

    const cls = classNames(
        'Segment-icon',
        segment?.speaker_is_interviewee
            ? 'Segment-icon--primary'
            : 'Segment-icon--secondary'
    );

    return (
        <span className={cls} title={title} aria-label={title}>
            {initials}
        </span>
    );
}

Initials.propTypes = {
    contributor: PropTypes.object,
    segment: PropTypes.object.isRequired,
};
