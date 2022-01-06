import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function UserContentDelete({
    id,
    title,
    description,
    onSubmit,
    deleteWorkbook,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    const destroy = () => {
        deleteWorkbook(pathBase, id);
        onSubmit();
    };

    return (
        <div>
            <p>{t('title') + ': '}
                <span>{title}</span>
            </p>
            <p>{t('description') + ': '}
                <span>{description}</span>
            </p>

            <button
                type="button"
                className="Button any-button"
                onClick={destroy}
            >
                {t('delete')}
            </button>
        </div>
    );
}

UserContentDelete.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    deleteWorkbook: PropTypes.func.isRequired,
};
