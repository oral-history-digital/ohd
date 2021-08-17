import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { setSkipEmptyRows, getSkipEmptyRows } from 'modules/archive';
import SelectColumnsFormContainer from './SelectColumnsFormContainer';

export default function EditTableHeaderOptions({
    numElements,
}) {
    const skipEmptyRows = useSelector(getSkipEmptyRows);
    const dispatch = useDispatch();
    const { t } = useI18n();

    function handleFilterChange(event) {
        const checked = event.target.checked;
        dispatch(setSkipEmptyRows(checked));
    }

    return (
        <div className="EditTableHeader-options">
            <span>
                <Modal
                    title={t('edit_column_header.select_columns')}
                    trigger={'Spalten auswählen'}
                    triggerClassName="StateButton EditTableHeader-button"
                >
                    {closeModal => <SelectColumnsFormContainer onSubmit={closeModal} />}
                </Modal>
            </span>
            <span>
                <label>
                    <input
                        type="checkbox"
                        checked={skipEmptyRows}
                        onChange={handleFilterChange}
                    />
                    {' '}
                    nur Segmente mit Überschriften, Verknüpfungen oder Anmerkungen
                </label>
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
