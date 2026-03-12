import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaSearch, FaTimes } from 'react-icons/fa';

export function ExplorerSearchInput({ value, onChange, onClear }) {
    const { t } = useI18n();

    return (
        <div className="ExplorerSidebarSearch-inputWrapper">
            <FaSearch className="ExplorerSidebarSearch-icon" />
            <input
                className="ExplorerSidebarSearch-input"
                type="text"
                value={value}
                onChange={onChange}
                placeholder={t('explorer.search_placeholder')}
            />
            {value && (
                <button
                    className="ExplorerSidebarSearch-clear"
                    onClick={onClear}
                    aria-label={t('explorer.clear_search')}
                    type="button"
                >
                    <FaTimes />
                </button>
            )}
        </div>
    );
}

ExplorerSearchInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};

export default ExplorerSearchInput;
