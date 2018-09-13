import React from 'react';

import RegistryReferenceFormContainer from '../containers/RegistryReferenceFormContainer';
import RegistryReferenceContainer from '../containers/RegistryReferenceContainer';
import { t, admin } from '../../../lib/utils';

export default class RegistryReferenceTypeSearchFacets extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.loadRegistryEntries();
        this.loadParentEntry();
    }

    componentDidUpdate() {
        this.loadRegistryEntries();
        this.loadParentEntry();
    }

    // shouldComponentUpdate(nextProps) {
    //     if(this.props.registryEntries && nextProps.registryEntries && Object.keys(this.props.registryEntries).length != Object.keys(nextProps.registryEntries).length){
    //         return true
    //     }
    //     return false
    // }

    loadRegistryEntries() {
        if (!this.props.registryEntriesStatus[`children_for_entry_${this.props.parentReferenceType.registry_entry_id}`]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `children_for_entry=${this.props.parentReferenceType.registry_entry_id}`);
        }
        if (!this.props.registryEntriesStatus[`children_for_entry_${this.props.parentEntryId}`]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `children_for_entry=${this.props.parentEntryId}`);
        }
    }

    loadParentEntry() {
        if (
            //(this.props.registryEntries && !this.props.registryEntries[this.props.parentEntryId]) ||
            !this.props.registryEntriesStatus[this.props.parentEntryId] ||
            (this.props.registryEntriesStatus[this.props.parentEntryId] &&
            this.props.registryEntriesStatus[this.props.parentEntryId].split('-')[0] === 'reload')
        ) {
            this.props.fetchData('registry_entries', this.props.parentEntryId);
        }
    }

    loadRegistryEntry(id){
        if (
            //(this.props.registryEntries && !this.props.registryEntries[this.props.parentEntryId]) ||
            !this.props.registryEntriesStatus[id] ||
            (this.props.registryEntriesStatus[id] &&
            this.props.registryEntriesStatus[id].split('-')[0] === 'reload')
        ) {
            this.props.fetchData('registry_entries', id);
        }
    }

    registryEntries() {
        let registryEntries = [];
        if (
            this.props.interview && 
            this.props.registryEntriesStatus[`children_for_entry_${this.props.parentEntryId}`] &&
            this.props.registryEntriesStatus[`children_for_entry_${this.props.parentEntryId}`].split('-')[0] === 'fetched'
        ) {
            for (var c in this.props.interview.registry_references) {  
                let registryReference = this.props.interview.registry_references[c];
                if (registryReference.registry_reference_type_id == this.props.parentReferenceType.id) {
                    this.loadRegistryEntry(registryReference.registry_entry_id);
                    let registryEntry = this.props.registryEntries[registryReference.registry_entry_id];
                    if (registryEntry) {
                        registryEntries.push(
                            <RegistryReferenceContainer 
                                registryEntry={registryEntry} 
                                registryReference={registryReference} 
                                refObjectType='interview'
                                locale={this.props.locale}
                                key={`registry_reference-${registryReference.id}`} 
                            />
                        );
                    }
                }
            }
        } 
        return registryEntries;
    }

    addRegistryReference() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={`${this.props.parentReferenceType.name[this.props.locale]} - ${t(this.props, 'edit.registry_reference.new')}`}
                onClick={() => this.props.openArchivePopup({
                    title: `${this.props.parentReferenceType.name[this.props.locale]} - ${t(this.props, 'edit.registry_reference.new')}`,
                    content: <RegistryReferenceFormContainer 
                                 refObject={this.props.interview} 
                                 refObjectType='Interview' 
                                 interview={this.props.interview} 
                                 registryEntryParentId={this.props.parentEntryId}
                                 locale={this.props.locale}
                                 goDeeper={true}
                                 //  allowed values: true, false, 'hidden'
                                 selectRegistryReferenceType={false}
                                 refTypeId={this.props.parentReferenceType.id}
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
                <h4>{this.props.parentReferenceType.name[this.props.locale]}</h4>
                {this.registryEntries()}
                {this.addRegistryReference()}
            </div>
        )
    }
}

