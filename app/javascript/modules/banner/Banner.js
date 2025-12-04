import { useIsEditor } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { getBanner } from './selectors';

export default function Banner({ onClose }) {
    const { locale } = useI18n();
    const banner = useSelector(getBanner);
    const isEditor = useIsEditor();

    if (banner.edit_mode_only && !isEditor) {
        return null;
    }

    const bannerMessage =
        locale == 'de' ? banner.message_de : banner.message_en;

    return (
        <div className="Banner">
            <div
                className="Banner-inner"
                dangerouslySetInnerHTML={{ __html: bannerMessage }}
            />
            <button
                onClick={onClose}
                className="Banner-close Button Button--icon"
                title="Close"
                aria-label="Close"
            >
                <FaTimes className="Icon" />
            </button>
        </div>
    );
}

Banner.propTypes = {
    onClose: PropTypes.func.isRequired,
};
