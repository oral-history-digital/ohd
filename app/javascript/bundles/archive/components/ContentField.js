import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function ContentField({
    label,
    noLabel = false,
    value,
    className,
    children,
}) {
    return (
        <div className={classNames('ContentField', className)}>
            {
                noLabel ?
                    null :
                    <span className="flyout-content-label">{label}:</span>
            }
            <span className={classNames('flyout-content-data', className)}>
                {value || '---'}
            </span>
            {children}
        </div>
    );
}

ContentField.propTypes = {
    label: PropTypes.string.isRequired,
    noLabel: PropTypes.bool,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default ContentField;
