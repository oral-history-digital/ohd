import PropTypes from 'prop-types';
import { FaCheck, FaTimes } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';

export default function BooleanCell({ getValue }) {
    const { locale } = useI18n();

    return getValue() ? <FaCheck /> : null;
}

BooleanCell.propTypes = {
    getValue: PropTypes.func.isRequired,
};
