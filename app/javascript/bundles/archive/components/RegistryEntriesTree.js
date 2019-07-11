import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import RegistryEntriesContainer from '../containers/RegistryEntriesContainer';
import RegistryEntrySearchResultContainer from '../containers/RegistryEntrySearchResultContainer';
import { t } from '../../../lib/utils';

export default class RegistryEntriesTree extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.loadRootRegistryEntry();
        window.scrollTo(0, 1);
    }

    componentDidUpdate() {
        this.loadRootRegistryEntry();
    }

    loadRootRegistryEntry() {
        // TODO: fit this for MOG - id of root entry will be different
        if (
            !this.props.registryEntriesStatus[1] ||
            this.props.registryEntriesStatus[1].split('-')[0] === 'reload'
        ) {
            this.props.fetchData('registry_entries', 1);
        }
    }

    foundRegistryEntries() {
        if (this.props.foundRegistryEntries.results.length == 0 && !this.props.isRegistryEntriesSearching) {
            return <div className={'search-result'}>{t(this.props, 'no_interviews_results')}</div>
        } else {
            return (
                this.props.foundRegistryEntries.results.map((result, index) => {
                    return (
                        <RegistryEntrySearchResultContainer 
                            result={result} 
                            key={`registry_entries-${result.registry_entry.id}-${index}`} 
                            //registryEntryParent={this.props.registryEntryParent}
                        />
                    )
                })
            )
        }
    }

    mergeRegistryEntries() {
        let id;
        let ids = [];
        this.props.foundRegistryEntries.results.map((result, index) => {
            if (index === 0) {
                id = result.registry_entry.id;
            } else {
                ids.push(result.registry_entry.id);
            }
        })
        this.props.submitData({merge_registry_entry: {id: id, ids: ids}}, this.props.locale);
    }

    mergeRegistryEntriesConfirm() {
        let title = t(this.props, 'activerecord.models.registry_entries.actions.merge');
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={title}
            onClick={() => this.props.openArchivePopup({
                title: title,
                content: (
                    <div>
                        <div className='any-button' onClick={() => this.mergeRegistryEntries()}>
                            {t(this.props, 'ok')}
                        </div>
                    </div>
                )
            })}
        >
            {title}
        </div>
    }

    content() {
        if (this.props.foundRegistryEntries.showRegistryEntriesTree) {
            return <RegistryEntriesContainer registryEntryParent={this.props.registryEntries[1]} />;
        } else {
            return (
                <div>
                    {this.mergeRegistryEntriesConfirm()}
                    <ul className={'registry-entries-ul'}>
                        {this.foundRegistryEntries()}
                    </ul>
                </div>
            )
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 3;
        if (this.props.registryEntriesStatus[1] && this.props.registryEntriesStatus[1].split('-')[0] === 'fetched') {
            return (
                <WrapperPageContainer tabIndex={tabIndex}>
                    <AuthShowContainer ifLoggedIn={true}>
                        <div className='wrapper-content register'>
                            <h1 className='registry-entries-title'>
                                {t(this.props, (this.props.project === 'mog') ? 'registry_mog' : 'registry')}
                            </h1>
                            {this.content()}
                        </div>
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {t(this.props, 'devise.failure.unauthenticated')}
                    </AuthShowContainer>
                </WrapperPageContainer>
            );
        } else {
            return null;
        }
    }
}
