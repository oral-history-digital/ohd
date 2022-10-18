import PropTypes from 'prop-types';
import { FaRegQuestionCircle } from 'react-icons/fa';
import useSWRImmutable from 'swr/immutable';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';

export default function HelpText({
    code,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const path = `${pathBase}/help_texts.json`;
    const { isLoading, data } = useSWRImmutable(path);

    if (isLoading) {
        return <Spinner small />;
    }

    let helpText = null;
    if (data) {
        helpText = data.find(ht => ht.code === code);
    }

    if (!helpText?.text && !helpText?.url) {
        return null;
    }

    return (
        <aside className="HelpText u-mb">
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
                                {helpText.text ?
                                    t('modules.help_text.more') :
                                    t('modules.help_text.wiki_link')
                                }
                            </a>
                        </p>
                    )}
                </div>
                <FaRegQuestionCircle
                    className="HelpText-icon u-ml-small"
                />
            </div>
        </aside>
    );
}

HelpText.propTypes = {
    code: PropTypes.string.isRequired,
}
