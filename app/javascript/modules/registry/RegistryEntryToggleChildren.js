import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

export default function RegistryEntryToggleChildren({
    count,
    isOpen,
    onToggle,
}) {
    const { t } = useI18n();

    if (count > 0) {
        return (
            <button
                className="Button Button--transparent Button--icon RegistryEntry-toggleChildren"
                title={`${count} ${t('edit.registry_entry.show_children')}`}
                onClick={onToggle}
            >
                {isOpen ? (
                    <FaMinus className="Icon Icon--primary" />
                ) : (
                    <FaPlus className="Icon Icon--primary" />
                )}
            </button>
        );
    } else {
        return <div className="RegistryEntry-toggleChildren" />;
    }
}

RegistryEntryToggleChildren.propTypes = {
    count: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};
