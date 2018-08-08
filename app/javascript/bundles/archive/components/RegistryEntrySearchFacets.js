import React from 'react';

import RegistryReferenceFormContainer from '../containers/RegistryReferenceFormContainer';
import RegistryEntryContainer from '../containers/RegistryEntryContainer';
import { t, admin } from '../../../lib/utils';

export default class RegistryEntrySearchFacets extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.loadRegistryEntries();
    }

    componentDidUpdate() {
        this.loadRegistryEntries();
    }

    loadRegistryEntries() {
        if (!this.props.registryEntriesStatus[`children_for_entry_${this.props.parentEntry.id}`]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `children_for_entry=${this.props.parentEntry.id}`);
        }
    }

    registryEntries() {
        let registryEntries = [];
        if (
            this.props.interview && 
            this.props.registryEntriesStatus[`children_for_entry_${this.props.parentEntry.id}`] &&
            this.props.registryEntriesStatus[`children_for_entry_${this.props.parentEntry.id}`].split('-')[0] === 'fetched'
        ) {
            for (var c in this.props.interview.registry_references) {
                let registryReference = this.props.interview.registry_references[c];
                let registryEntry = this.props.registryEntries[registryReference.registry_entry_id];
                if (registryEntry && registryEntry.parent_ids.indexOf(this.props.parentEntry.id) > -1 && registryReference !== 'fetched') {
                    registryEntries.push(
                        <RegistryEntryContainer 
                            registryEntry={registryEntry} 
                            registryReference={registryReference} 
                            refObjectType='interview'
                            key={`registry_reference-${registryReference.id}`} 
                        />
                    );
                }
            }
        } 
        return registryEntries;
    }

    addRegistryReference() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_reference.new')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_reference.new'),
                    content: <RegistryReferenceFormContainer 
                                 refObject={this.props.interview} 
                                 refObjectType='Interview' 
                                 interview={this.props.interview} 
                                 registryEntryParent={this.props.parentEntry}
                             />
                })}
            >
                <i className="fa fa-plus"></i>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h4>{this.props.parentEntry.name[this.props.locale]}</h4>
                {this.registryEntries()}
                {this.addRegistryReference()}
            </div>
        )
    }
}

