import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { HelpText } from 'modules/help-text';
import {
    EDIT_TABLE_FILTER_ALL,
    EDIT_TABLE_FILTER_SOME,
    EDIT_TABLE_FILTER_HEADINGS,
    EDIT_TABLE_FILTER_REFERENCES,
    EDIT_TABLE_FILTER_ANNOTATIONS
} from '../constants';
import { setFilter } from '../actions';
import { getFilter } from '../selectors';
import SelectColumnsFormContainer from './SelectColumnsFormContainer';

export default function EditTableHeaderOptions({
    numElements,
}) {
    const { t } = useI18n();
    const filter = useSelector(getFilter);
    const dispatch = useDispatch();

    function handleFilterChange(event) {
        dispatch(setFilter(event.target.value));
    }

    return (
        <div className="EditTableHeader-options">
            <span>
                <Modal
                    title={t('edit_column_header.select_columns')}
                    trigger={t('edit_column_header.select_columns')}
                    triggerClassName="StateButton EditTableHeader-button"
                >
                    {closeModal => (
                        <SelectColumnsFormContainer
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </span>
            <span>
                <label>
                    {t('modules.edit_table.filter.label')}:
                    {' '}
                    <select
                        className="EditTableHeader-select"
                        value={filter}
                        onChange={handleFilterChange}
                    >
                        <option value={EDIT_TABLE_FILTER_ALL}>
                            {t('modules.edit_table.filter.all')}
                        </option>
                        <option value={EDIT_TABLE_FILTER_SOME}>
                            {t('modules.edit_table.filter.some')}
                        </option>
                        <option value={EDIT_TABLE_FILTER_HEADINGS}>
                            {t('modules.edit_table.filter.headings')}
                        </option>
                        <option value={EDIT_TABLE_FILTER_REFERENCES}>
                            {t('modules.edit_table.filter.references')}
                        </option>
                        <option value={EDIT_TABLE_FILTER_ANNOTATIONS}>
                            {t('modules.edit_table.filter.annotations')}
                        </option>
                    </select>
                </label>
            </span>
            <span>
                {numElements} {t('modules.edit_table.segments')}
            </span>
            <HelpText
                code="edit_table"
                small
                className="HelpText--reversed u-ml-auto"
            />
        </div>
    );
}

EditTableHeaderOptions.propTypes = {
    numElements: PropTypes.number.isRequired,
};
