import PropTypes from 'prop-types';

export default function Initials({ initials = '?', className, title }) {
    return (
        <span className={className} title={title} aria-label={title}>
            {initials}
        </span>
    );
}

Initials.propTypes = {
    initials: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
};
