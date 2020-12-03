import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import spinnerSrc from 'images/large_spinner.gif';

export default function Spinner({
    withPadding = false,
    className,
    style,
}) {
    return (
        <img
            src={spinnerSrc}
            className={classNames('Spinner', className, {
                'Spinner--withPadding': withPadding,
            })}
            style={style}
            alt=""
        />
    );
}

Spinner.propTypes = {
    withPadding: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};
