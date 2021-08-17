import { Fragment } from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { RegistrySearchFormContainer } from 'modules/registry';
import DownloadRegistryEntriesContainer from './DownloadRegistryEntriesContainer';

function RegistryEntriesTabPanel(props) {
    const { t } = useI18n();

    return (
        <Fragment>
            <div className='flyout-tab-title'>{t('registry')}</div>
            <div className='flyout-sub-tabs-container'>
                <RegistrySearchFormContainer />
                <p>
                    <button onClick={() => props.changeRegistryEntriesViewMode(!props.showRegistryEntriesTree)}>
                        {t('activerecord.models.registry_entry.actions.' + (props.showRegistryEntriesTree ? 'show_search_results' : 'show_tree'))}
                    </button>
                </p>
                {
                    props.projectId != 'mog' ?
                        props.locales.map((locale) => (
                            <AuthorizedContent key={locale} object={{type: 'General', action: 'edit'}}>
                                <div key={locale}>
                                    <DownloadRegistryEntriesContainer format="pdf" specificLocale={locale} />
                                    <DownloadRegistryEntriesContainer format="csv" specificLocale={locale} />
                                </div>
                            </AuthorizedContent>
                        )) :
                        null
                }
                {
                    (props.projectId === 'mog') ?
                            <div key={props.locale}>
                                <p>
                                    <a href={`/alfa-${props.locale}.pdf`}>
                                        <i
                                            className="fa fa-download flyout-content-ico"
                                            title={t('download_registry_entries', { format: 'pdf' , locale: props.locale })}
                                        />
                                        <span>
                                            {` ${t('download_registry_entries', { format: 'pdf', locale: props.locale })}`}
                                        </span>
                                    </a>
                                </p>
                            </div>
                        :
                        null
                }
            </div>
        </Fragment>
    );
}

RegistryEntriesTabPanel.propTypes = {
    projectId: PropTypes.string.isRequired,
    showRegistryEntriesTree: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    locales: PropTypes.array.isRequired,
    translations: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    changeRegistryEntriesViewMode: PropTypes.func.isRequired,
};

export default RegistryEntriesTabPanel;
