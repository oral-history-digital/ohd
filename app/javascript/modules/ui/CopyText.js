import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FaCopy } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useI18n } from 'modules/i18n';
import { useCopyState } from 'modules/react-toolbox';

export default function CopyText({
    className,
    iconClassName,
    text,
    title,
    iconComponent = FaCopy,
    children,
}) {
    const { copied, setToCopied } = useCopyState();
    const { t } = useI18n();

    const IconComponent = iconComponent;

    return (
        <CopyToClipboard text={text} onCopy={setToCopied}>
            <button
                className={classNames(
                    'Button',
                    'Button--transparent',
                    'Button--icon',
                    className
                )}
                type="button"
                aria-label={t('modules.ui.copy_link')}
                title={title || t('modules.ui.copy_link')}
            >
                <IconComponent
                    className={classNames(
                        'Icon',
                        copied ? 'Icon--attention' : iconClassName
                    )}
                />{' '}
                {children}
            </button>
        </CopyToClipboard>
    );
}

CopyText.propTypes = {
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    iconComponent: PropTypes.node,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
