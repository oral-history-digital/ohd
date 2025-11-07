import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

function Messages({
    loggedInAt,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    if (loggedInAt + 5000 > Date.now()) {
        return (
            <p className='messages'>
                {t('devise.omniauth_callbacks.success')}
            </p>
        )
    } else {
        return null;
    }
}

Messages.propTypes = {
    loggedInAt: PropTypes.number,
};

export default Messages;
