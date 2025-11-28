import { useI18n } from 'modules/i18n';
import { DebouncedInput } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

export default function Filter({ column }) {
    const { t } = useI18n();
    const columnFilterValue = column.getFilterValue();

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            column.setFilterValue('');
        }
    }

    return (
        <>
            <DebouncedInput
                type="text"
                className="Input"
                value={columnFilterValue ?? ''}
                onChange={column.setFilterValue}
                onKeyDown={handleKeyDown}
                placeholder={t('modules.catalog.table.search')}
            />
            <button
                type="button"
                className="Input-clear Button Button--transparent Button--icon"
                onClick={() => column.setFilterValue('')}
            >
                <FaTimes className="Icon Icon--unobtrusive" />
            </button>
        </>
    );
}

Filter.propTypes = {
    column: PropTypes.object.isRequired,
};
