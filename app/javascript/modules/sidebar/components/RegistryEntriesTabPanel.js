import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { RegistrySearchFormContainer } from 'modules/registry';
import DownloadRegistryEntriesContainer from './DownloadRegistryEntriesContainer';
import { PROJECT_MOG } from 'modules/constants';

function RegistryEntriesTabPanel(props) {
    const { t } = useI18n();

    return (
        <Fragment>
            <h3 className='SidebarTabs-title'>
                {t('registry')}
            </h3>
            <div className='flyout-sub-tabs-container'>
                <RegistrySearchFormContainer />
                <p>
                    <button
                        type="button"
                        className="Button"
                        onClick={() => props.changeRegistryEntriesViewMode(!props.showRegistryEntriesTree)}
                    >
                        {t('activerecord.models.registry_entry.actions.' + (props.showRegistryEntriesTree ? 'show_search_results' : 'show_tree'))}
                    </button>
                </p>
                {
                    props.projectId != PROJECT_MOG ?
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
                    (props.projectId === PROJECT_MOG) ?
                            <div key={props.locale}>
                                <p>
                                    <a href={`/alfa-${props.locale}.pdf`}>
                                        <FaDownload
                                            className="Icon Icon--primary"
                                            title={t('download_registry_entries', { format: 'pdf' , locale: props.locale })}
                                        />
                                        {' '}
                                        {t('download_registry_entries', { format: 'pdf', locale: props.locale })}
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
