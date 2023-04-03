import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

function Messages({
    loggedInAt,
    isRegistered,
    notifications,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    if (loggedInAt + 5000 > Date.now()) {
        return (
            <p className='messages'>
                {t('devise.omniauth_callbacks.success')}
            </p>
        )
    } else if (isRegistered) {
        return (
            <p className='messages'>
                {t('devise.registrations.signed_up')}
            </p>
        )
    } else if (notifications.length > 0) {
        return (
            <div className='notifications'>
                {notifications.map((notification, index) => {
                    return (
                        <p key={`notification-${index}`}>
                            {t(notification.title, {file: notification.file, archiveId: notification.archive_id})}
                            <Link
                                to={pathBase + '/interviews/' + notification.archive_id}>
                                {notification.archive_id}
                            </Link>
                        </p>
                    )
                })}
            </div>
        )
    } else {
        return null;
    }
}

Messages.propTypes = {
    loggedInAt: PropTypes.number,
    notifications: PropTypes.array.isRequired,
};

export default Messages;
