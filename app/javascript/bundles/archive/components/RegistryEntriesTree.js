import React, { Fragment } from 'react';
import AuthShowContainer from '../containers/AuthShowContainer';
import RegistryEntriesContainer from '../containers/RegistryEntriesContainer';
import RegistryEntrySearchResultContainer from '../containers/RegistryEntrySearchResultContainer';
import { t, admin } from 'lib/utils';
import { INDEX_REGISTRY_ENTRIES } from '../constants/flyoutTabs';

export default class RegistryEntriesTree extends React.Component {
    componentDidMount() {
        this.loadRootRegistryEntry();
        window.scrollTo(0, 1);

        this.props.setFlyoutTabsIndex(INDEX_REGISTRY_ENTRIES);
    }

    componentDidUpdate() {
        this.loadRootRegistryEntry();
    }

    loadRootRegistryEntry() {
        if (
            !this.props.registryEntriesStatus[this.props.project.root_registry_entry_id] ||
            this.props.registryEntriesStatus[this.props.project.root_registry_entry_id].split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.project.root_registry_entry_id);
        }
    }

    foundRegistryEntries() {
        if (this.props.foundRegistryEntries.results.length == 0 && !this.props.isRegistryEntriesSearching) {
            return <div className={'search-result'}>{`0 ${t(this.props, 'registryentry_results')}`}</div>
        } else {
            return (
                this.props.foundRegistryEntries.results.map((result, index) => {
                    return (
                        <RegistryEntrySearchResultContainer
                            result={result}
                            key={result.id}
                        />
                    );
                })
            )
        }
    }

    mergeRegistryEntries() {
        let id;
        let ids = [];
        this.props.selectedRegistryEntryIds.filter(i => i !== 'dummy').map((rid, index) => {
            if (index === 0) {
                id = rid;
            } else {
                ids.push(rid);
            }
        })
        this.props.submitData(this.props, {merge_registry_entry: {id: id, ids: ids}});
        this.props.closeArchivePopup();
    }

    mergeRegistryEntriesConfirm() {
        if (admin(this.props, {type: 'RegistryEntry', action: 'update'}) && this.props.selectedRegistryEntryIds.length > 2) {
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
    }

    content() {
        if (this.props.foundRegistryEntries.showRegistryEntriesTree) {
            return (
                <RegistryEntriesContainer
                    registryEntryParent={this.props.registryEntries[this.props.project.root_registry_entry_id]}
                    root
                />
            );
        } else {
            return (
                <div>
                    <ul className="RegistryEntryList RegistryEntryList--root">
                        {this.foundRegistryEntries()}
                    </ul>
                </div>
            )
        }
    }

    render() {
        if (
            this.props.registryEntriesStatus[this.props.project.root_registry_entry_id] &&
            this.props.registryEntriesStatus[this.props.project.root_registry_entry_id].split('-')[0] === 'fetched'
        ) {
            return (
                <Fragment>
                    <AuthShowContainer ifLoggedIn={true}>
                        <div className='wrapper-content register'>
                            <h1 className='registry-entries-title'>
                                {t(this.props, (this.props.project === 'mog') ? 'registry_mog' : 'registry')}
                            </h1>
                            {this.mergeRegistryEntriesConfirm()}
                            {this.content()}
                        </div>
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                        {t(this.props, 'devise.failure.unauthenticated')}
                    </AuthShowContainer>
                </Fragment>
            );
        } else {
            return null;
        }
    }
}
