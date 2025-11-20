import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function DeleteItemForm({ children, onSubmit, onCancel }) {
    const { t } = useI18n();

    return (
        <form className="Form">
            {children}

            <div className="Form-footer u-mt">
                <button
                    type="button"
                    className="Button Button--primaryAction"
                    onClick={onSubmit}
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

DeleteItemForm.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
