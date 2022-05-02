import { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FaCopy } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useI18n } from 'modules/i18n';

export default function CopyLink({
    url,
}) {
    const [copied, setCopied] = useState(false);
    const { t } = useI18n();

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    function handleClick() {
        setCopied(true);
    }

    return (
        <CopyToClipboard
            text={url}
            onCopy={handleClick}
        >
            <button
                className="Button Button--icon Button--transparent"
                type="button"
                aria-label={t('modules.workbook.copy_link')}
                title={t('modules.workbook.copy_link')}
            >
                <FaCopy
                    className={classNames('Icon', copied ?
                        'Icon--attention' : 'Icon--primary')}
                />
            </button>
        </CopyToClipboard>
    );
}

CopyLink.propTypes = {
    url: PropTypes.string.isRequired,
};
