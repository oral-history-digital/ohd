import classNames from 'classnames';
import PropTypes from 'prop-types';

import spinnerSrc from './large_spinner.gif';

export default function Spinner({
    small = false,
    withPadding = false,
    className,
    style,
}) {
    return (
        <img
            src={spinnerSrc}
            className={classNames('Spinner', className, {
                'Spinner--small': small,
                'Spinner--withPadding': withPadding,
            })}
            style={style}
            alt=""
        />
    );
}

Spinner.propTypes = {
    small: PropTypes.bool,
    withPadding: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};
