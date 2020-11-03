import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { t } from '../../../../lib/utils';

function Messages(props) {
    if (props.loggedInAt + 5000 > Date.now()) {
        return (
            <p className='messages'>
                {t(props, 'devise.omniauth_callbacks.success')}
            </p>
        )
    } else if (props.notifications.length > 0) {
        return (
            <div className='notifications'>
                {props.notifications.map((notification, index) => {
                    return (
                        <p key={`notification-${index}`}>
                            {t(props, notification.title, {file: notification.file, archiveId: notification.archive_id})}
                            <Link
                                to={'/' + props.locale + '/interviews/' + notification.archive_id}>
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
    loggedInAt: PropTypes.number.isRequired,
    notifications: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};

export default Messages;
