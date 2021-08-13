import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaEdit, FaFilter, FaColumns } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import SelectColumnsFormContainer from './SelectColumnsFormContainer';

export default function EditTableButtons({
    editViewEnabled,
    skipEmptyRows,
    changeToInterviewEditView,
    setSkipEmptyRows,
}) {
    const { t } = useI18n();

    return (
        <>
            {
                editViewEnabled ?
                    (<>
                        <Modal
                            title={t('edit_column_header.select_columns')}
                            trigger={<FaColumns className="StateButton-icon" />}
                            triggerClassName="StateButton"
                        >
                            {closeModal => <SelectColumnsFormContainer onSubmit={closeModal} />}
                        </Modal>

                        <button
                            className={classNames('StateButton', { 'is-pressed': skipEmptyRows })}
                            type="button"
                            title={t(`edit_column_header.${skipEmptyRows ? 'skip_rows_off' : 'skip_rows_on'}`)}
                            onClick={() => setSkipEmptyRows(!skipEmptyRows)}
                        >
                            <FaFilter className="StateButton-icon" />
                        </button>
                    </>) :
                    null
            }
            <button
                className={classNames('StateButton', { 'is-pressed': editViewEnabled })}
                type="button"
                title={t(`edit_column_header.${editViewEnabled ? 'close_table' : 'open_table'}`)}
                onClick={() => changeToInterviewEditView(!editViewEnabled)}
            >
                <FaEdit className="StateButton-icon" />
            </button>
        </>
    );
}

EditTableButtons.propTypes = {
    editViewEnabled: PropTypes.bool.isRequired,
    skipEmptyRows: PropTypes.bool.isRequired,
    changeToInterviewEditView: PropTypes.func.isRequired,
    setSkipEmptyRows: PropTypes.func.isRequired,
};
