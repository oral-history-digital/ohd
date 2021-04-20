import React from 'react';
import PropTypes from 'prop-types';
import { useAuthorization } from './authorization-hook';
import { useI18n } from 'modules/i18n';

function AuthorizedContent({
    object,
    children,
    showUnauthorizedMsg,
    showIfPublic
}) {
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();

    if (
        Array.isArray(object) ? 
        object.find(obj => (showIfPublic && obj.workflow_state === 'public') || isAuthorized(obj)) : 
        (showIfPublic && object.workflow_state === 'public') || isAuthorized(object)
    )
    {
        return children;
    }

    if (showUnauthorizedMsg) {
        return (
            <p>
                {t('unauthorized')}
            </p>
        );
    } else {
        return null;
    }
}

AuthorizedContent.propTypes = {
    object: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.object
    ]).isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};

export default AuthorizedContent;
