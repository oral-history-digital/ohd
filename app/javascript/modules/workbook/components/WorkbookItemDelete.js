import PropTypes from 'prop-types';

import { useWorkbookApi } from 'modules/api';
import { useI18n } from 'modules/i18n';

import useMutateWorkbook from '../useMutateWorkbook';

export default function WorkbookItemDelete({
    id,
    title,
    description,
    onSubmit,
    onCancel,
}) {
    const { t } = useI18n();
    const mutateWorkbook = useMutateWorkbook();
    const { deleteWorkbookItem } = useWorkbookApi();

    const destroy = () => {
        mutateWorkbook(async workbook => {
            await deleteWorkbookItem(id);

            const updatedWorkbook = {
                ...workbook,
                data: { ...workbook.data }
            };
            delete updatedWorkbook.data[id];

            return updatedWorkbook;
        });

        onSubmit();
    };

    return (
        <form className="Form">
            <p>{t('title') + ': '}
                <span>{title}</span>
            </p>
            <p>{t('description') + ': '}
                <span>{description}</span>
            </p>

            <div className="Form-footer">
                <button
                    type="button"
                    className="Button Button--primaryAction"
                    onClick={destroy}
                >
                    {t('delete')}
                </button>
                <button
                    type="button"
                    className="Button Button--secondaryAction"
                    onClick={onCancel}
                >
                    {t('cancel')}
                </button>
            </div>
        </form>
    );
}

WorkbookItemDelete.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
