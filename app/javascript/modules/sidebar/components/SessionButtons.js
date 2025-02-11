import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function SessionButtons({ className }) {
    return (
        <div className={classNames('SessionButtons', className)}>
            <a href="">Register</a>
            {' '}
            <a href="">Login</a>
        </div>
    );
}

SessionButtons.propTypes = {
    className: PropTypes.string,
};
