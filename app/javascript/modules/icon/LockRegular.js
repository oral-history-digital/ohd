import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function LockRegular({
    className,
    style,
}) {
    return (
        <svg
            className={classNames('svg-inline--fa', className)}
            style={style}
            aria-hidden="true"
            data-prefix="far"
            data-icon="lock"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
        >
            <path
                fill="currentColor"
                d="M400 192h-32v-46.6C368 65.8 304 .2 224.4 0 144.8-.2 80 64.5 80 144v48H48c-26.5 0-48 21.5-48 48v224c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V240c0-26.5-21.5-48-48-48zm-272-48c0-52.9 43.1-96 96-96s96 43.1 96 96v48H128v-48zm272 320H48V240h352v224z"
                className=""
            />
        </svg>
    );
}

LockRegular.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};
