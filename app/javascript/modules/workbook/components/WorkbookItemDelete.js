import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function WorkbookItemDelete({
    id,
    title,
    description,
    onSubmit,
    onCancel,
    deleteWorkbook,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    const destroy = () => {
        deleteWorkbook(pathBase, id);
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
    deleteWorkbook: PropTypes.func.isRequired,
};
