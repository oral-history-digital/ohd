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
    const skipEmptyRows = useSelector(getSkipEmptyRows);
    const dispatch = useDispatch();
    const { t } = useI18n();

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
                <select
                    className="EditTableHeader-select"
                    value={value}
                    onChange={handleFilterChange}
                >
                    <option value="all">Alle Segmente</option>
                    <option value="filtered">Überschriften, Verknüpfungen u. Anmerkungen</option>
                </select>
            </span>
            <span>
                {numElements} Segmente
            </span>
        </div>
    );
}

EditTableHeaderOptions.propTypes = {
    numElements: PropTypes.number.isRequired,
};
