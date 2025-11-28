import { useI18n } from 'modules/i18n';
import { DebouncedInput } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

export default function Filter({ className, onChange, value }) {
    const { t } = useI18n();

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            onChange('');
        }
    }

    return (
        <div className={className}>
            <DebouncedInput
                type="text"
                className="Input"
                value={value ?? ''}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={t('modules.catalog.table.search')}
            />
            <button
                type="button"
                className="Input-clear Button Button--transparent Button--icon"
                onClick={() => onChange('')}
            >
                <FaTimes className="Icon Icon--unobtrusive" />
            </button>
        </div>
    );
}

Filter.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};
