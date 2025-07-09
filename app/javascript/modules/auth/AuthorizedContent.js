import PropTypes from 'prop-types';
import { useAuthorization } from './authorization-hook';
import { useI18n } from 'modules/i18n';

function AuthorizedContent({
    object,
    action,
    children,
    unauthorizedContent,
    showUnauthorizedMsg,
    showIfPublic
}) {
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();

    if (
        Array.isArray(object) ? 
        object.find(obj => (showIfPublic && obj.workflow_state === 'public') || isAuthorized(obj, action)) : 
        (showIfPublic && object.workflow_state === 'public') || isAuthorized(object, action)
    )
    {
        return children || null;
    }

    if (unauthorizedContent) {
        return unauthorizedContent;
    } else if (showUnauthorizedMsg) {
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
