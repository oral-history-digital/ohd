import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaRegQuestionCircle } from 'react-icons/fa';
import useSWRImmutable from 'swr/immutable';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';

export default function HelpText({ className, style, code, small = false }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const path = `${pathBase}/help_texts.json`;
    const { isLoading, data } = useSWRImmutable(path);

    if (isLoading) {
        return <Spinner size="small" />;
    }

    let helpText = null;
    if (data) {
        helpText = data.find((ht) => ht.code === code);
    }

    if (!helpText?.text && !helpText?.url) {
        return null;
    }

    if (small) {
        return (
            <aside
                style={style}
                className={classNames('HelpText', 'HelpText--small', className)}
            >
                <div className="HelpText-inner">
                    <a
                        className="HelpText-link"
                        href={helpText.url}
                        target="_blank"
                        rel="noreferrer"
                        title={t('modules.help_text.wiki_link')}
                        aria-label={t('modules.help_text.wiki_link')}
                    >
                        <FaRegQuestionCircle className="HelpText-icon" />
                    </a>
                </div>
            </aside>
        );
    }

    return (
        <aside style={style} className={classNames('HelpText', className)}>
            <div className="HelpText-inner">
                <div className="HelpText-body">
                    {helpText.text && (
                        <p className="HelpText-text">{helpText.text}</p>
                    )}
                    {helpText.url && (
                        <p className="HelpText-text u-align-right">
                            <a
                                className="HelpText-link"
                                href={helpText.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {helpText.text
                                    ? t('modules.help_text.more')
                                    : t('modules.help_text.wiki_link')}
                            </a>
                        </p>
                    )}
                </div>
                <FaRegQuestionCircle className="HelpText-icon u-ml-small" />
            </div>
        </aside>
    );
}

HelpText.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    code: PropTypes.string.isRequired,
    small: PropTypes.bool,
};
