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

    content() {
        if (this.props.foundRegistryEntries.showRegistryEntriesTree) {
            return <RegistryEntriesContainer registryEntryParent={this.props.registryEntries[1]} />;
        } else {
            return this.foundRegistryEntries();
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 4;
        if (this.props.registryEntriesStatus[1] && this.props.registryEntriesStatus[1].split('-')[0] === 'fetched') {
            return (
                <WrapperPageContainer tabIndex={tabIndex}>
                    <AuthShowContainer ifLoggedIn={true}>
                        {this.content()}
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
