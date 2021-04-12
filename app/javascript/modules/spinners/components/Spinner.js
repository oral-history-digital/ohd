import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Spinner.module.scss';
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
            className={classNames(styles.img, className, {
                [styles.withPadding]: withPadding,
                [styles.small]: small,
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
