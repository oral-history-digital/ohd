import React, { Fragment } from 'react';
import AuthShowContainer from '../containers/AuthShowContainer';
import RegistryEntriesContainer from '../containers/RegistryEntriesContainer';
import RegistryEntrySearchResultContainer from '../containers/RegistryEntrySearchResultContainer';
import { t, admin } from '../../../lib/utils';

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
            this.props.fetchData(this.props, 'registry_entries', 1);
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
                            key={`registry_entries-${result.id}-${index}`}
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
            return <RegistryEntriesContainer registryEntryParent={this.props.registryEntries[1]} />;
        } else {
            return (
                <div>
                    <ul className={'registry-entries-ul'}>
                        {this.foundRegistryEntries()}
                    </ul>
                </div>
            )
        }
    }

    render() {
        if (this.props.registryEntriesStatus[1] && this.props.registryEntriesStatus[1].split('-')[0] === 'fetched') {
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
