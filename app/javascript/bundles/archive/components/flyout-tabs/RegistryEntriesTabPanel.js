import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import RegistryEntrySearchFormContainer from '../../containers/RegistryEntrySearchFormContainer';
import DownloadRegistryEntriesContainer from '../../containers/flyout-tabs/DownloadRegistryEntriesContainer';
import AuthorizedContent from '../AuthorizedContent';

import { useI18n } from '../../hooks/i18n';

function RegistryEntriesTabPanel(props) {
    const { t } = useI18n();

    return (
        <Fragment>
            <div className='flyout-tab-title'>{t(props.projectId === 'mog' ? 'registry_mog' : 'registry')}</div>
            <div className='flyout-sub-tabs-container'>
                <RegistryEntrySearchFormContainer />
                <p>
                    <button onClick={() => props.changeRegistryEntriesViewMode(!props.showRegistryEntriesTree)}>
                        {t('activerecord.models.registry_entries.actions.' + (props.showRegistryEntriesTree ? 'show_search_results' : 'show_tree'))}
                    </button>
                </p>
                {
                    props.projectId != 'mog' ?
                        props.locales.map((locale) => (
                            <AuthorizedContent object={{type: 'General', action: 'edit'}}>
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
                        props.locales.map((locale) => (
                            <div key={locale}>
                                <p>
                                    <a href={`/alfa-${locale}.pdf`}>
                                        <i
                                            className="fa fa-download flyout-content-ico"
                                            title={t('download_registry_entries', { format: 'pdf' , locale: locale })}
                                        />
                                        <span>
                                            {` ${t('download_registry_entries', { format: 'pdf', locale: locale })}`}
                                        </span>
                                    </a>
                                </p>
                            </div>
                        )) :
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
