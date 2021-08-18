import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { setSkipEmptyRows } from '../actions';
import { getSkipEmptyRows } from '../selectors';
import SelectColumnsFormContainer from './SelectColumnsFormContainer';

export default function EditTableHeaderOptions({
    numElements,
}) {
    const { t } = useI18n();
    const skipEmptyRows = useSelector(getSkipEmptyRows);
    const dispatch = useDispatch();

    const value = skipEmptyRows ? 'filtered' : 'all';

    function handleFilterChange(event) {
        const filter = event.target.value === 'filtered';
        dispatch(setSkipEmptyRows(filter));
    }

    return (
        <div className="EditTableHeader-options">
            <span>
                <Modal
                    title={t('edit_column_header.select_columns')}
                    trigger={t('edit_column_header.select_columns')}
                    triggerClassName="StateButton EditTableHeader-button"
                >
                    {closeModal => <SelectColumnsFormContainer onSubmit={closeModal} />}
                </Modal>
            </span>
            <span>
                <label>
                    {t('modules.edit_table.filter.label')}:
                    {' '}
                    <select
                        className="EditTableHeader-select"
                        value={value}
                        onChange={handleFilterChange}
                    >
                        <option value="all">{t('modules.edit_table.filter.all')}</option>
                        <option value="filtered">{t('modules.edit_table.filter.filtered')}</option>
                    </select>
                </label>
            </span>
            <span>
                {numElements} {t('modules.edit_table.segments')}
            </span>
        </div>
    );
}

EditTableHeaderOptions.propTypes = {
    numElements: PropTypes.number.isRequired,
};
