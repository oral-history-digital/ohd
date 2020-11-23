import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from '../../hooks/i18n';

function Label({
    label,
    labelKey,
    scope,
    attribute,
    mandatory = false,
    htmlFor,
    className,
}) {
    const { t } = useI18n();

    let l;
    if (label) {
        l = label;
    } else if (labelKey) {
        l = t(labelKey);
    } else {
        // Scope is equivalent to model here.
        l = t(`activerecord.attributes.${scope}.${attribute}`);
    }

    return (
        <div className={classNames('form-label', className)}>
            <label className="FormLabel" htmlFor={htmlFor}>
                {`${l}${mandatory ? ' *' : ''}`}
            </label>
        </div>
    );
}

Label.propTypes = {
    label: PropTypes.string,
    labelKey: PropTypes.string,
    scope: PropTypes.string,
    attribute: PropTypes.string,
    mandatory: PropTypes.bool.isRequired,
    htmlFor: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Label;
