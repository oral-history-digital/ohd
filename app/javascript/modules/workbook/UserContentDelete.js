import React from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function UserContentDelete({
    id,
    title,
    description,
    locale,
    projectId,
    projects,
    deleteData,
    onSubmit,
}) {
    const { t } = useI18n();

    const destroy = () => {
        deleteData({ locale, projectId, projects }, 'user_contents', id);
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
                className="any-button"
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
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
