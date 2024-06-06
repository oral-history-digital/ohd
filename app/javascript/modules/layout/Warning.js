import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';

export default function Warning({
    onClose,
}) {
    const { t } = useI18n();

    return (
        <div className="Warning">
            <div className="Warning-body u-align-center">
                {t('modules.layout.warning.text')}
            </div>
            <button
                onClick={onClose}
                className="Warning-close Button Button--icon"
                title="Close"
                aria-label="Close"
            >
                <FaTimes className="Icon" />
            </button>
        </div>
    );
}

Warning.propTypes = {
    onClose: PropTypes.func.isRequired,
};
