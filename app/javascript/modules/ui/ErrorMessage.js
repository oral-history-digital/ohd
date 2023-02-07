import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';

const ERROR_MESSAGE_TYPE_DEFAULT = 'default';

export default function ErrorMessage({
    type = ERROR_MESSAGE_TYPE_DEFAULT,
    children,
    className
}) {
    const { t } = useI18n();

    return (
        <div className={classNames('ErrorMessage', `ErrorMessage--${type}`, className)}>
            <b>{t('modules.ui.error_message.error')}:</b>
            {' '}
            {children}
        </div>
    );
}

ErrorMessage.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    type: PropTypes.string,
    className: PropTypes.string
};
