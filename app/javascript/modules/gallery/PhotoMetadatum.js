import React from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function PhotoMetadatum({
    className,
    label,
    value,
}) {
    const { t } = useI18n();

    return (
        <p className={className}>
            {t(`activerecord.attributes.photo.${label}`)}: {value}
        </p>
    );
}

PhotoMetadatum.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};
