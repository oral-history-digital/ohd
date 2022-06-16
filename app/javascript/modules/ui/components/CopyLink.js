import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FaCopy } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useI18n } from 'modules/i18n';
import { useCopyState } from 'modules/react-toolbox';

export default function CopyLink({
    className,
    iconClassName,
    url,
    children,
}) {
    const { copied, setToCopied } = useCopyState();
    const { t } = useI18n();

    return (
        <CopyToClipboard
            text={url}
            onCopy={setToCopied}
        >
            <button
                className={classNames('Button', 'Button--transparent',
                    'Button--icon', className)}
                type="button"
                aria-label={t('modules.ui.copy_link')}
                title={t('modules.ui.copy_link')}
            >
                <FaCopy
                    className={classNames('Icon', copied ?
                        'Icon--attention' : iconClassName)}
                /> {children}
            </button>
        </CopyToClipboard>
    );
}

CopyLink.propTypes = {
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    url: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
