import React from 'react';

import RegistryReferenceFormContainer from '../containers/RegistryReferenceFormContainer';
import RegistryReferenceContainer from '../containers/RegistryReferenceContainer';
import { t, admin } from '../../../lib/utils';

export default class PersonPropertiesRegistryReferenceType extends React.Component {

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
        if (!this.props.registryEntriesStatus[`references_for_interview_${this.props.interview.archive_id}_type_id_${this.props.referenceType.id}`]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `references_for_interview=${this.props.interview.archive_id}&type_id=${this.props.referenceType.id}`);
        }
    }

    registryEntries() {
        let registryEntries = [];
        if (
            this.props.interview && 
            this.props.registryEntriesStatus[`references_for_interview_${this.props.interview.archive_id}_type_id_${this.props.referenceType.id}`] &&
            this.props.registryEntriesStatus[`references_for_interview_${this.props.interview.archive_id}_type_id_${this.props.referenceType.id}`].split('-')[0] === 'fetched'
        ) {
            for (var c in this.props.interview.registry_references) {  
                let registryReference = this.props.interview.registry_references[c];
                let registryEntry = this.props.registryEntries[registryReference.registry_entry_id];
                if (registryReference.registry_reference_type_id == this.props.referenceType.id) {
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
        if (registryEntries.length > 0) {
        return registryEntries;
        } else if (!admin(this.props)){
            return (
                <span>---</span>
            )
    }
    }

    addRegistryReference() {
        if (admin(this.props)) {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={`${this.props.referenceType.name[this.props.locale]} - ${t(this.props, 'edit.registry_reference.new')}`}
                onClick={() => this.props.openArchivePopup({
                    title: `${this.props.referenceType.name[this.props.locale]} - ${t(this.props, 'edit.registry_reference.new')}`,
                    content: <RegistryReferenceFormContainer 
                                 refObject={this.props.interview} 
                                 refObjectType='Interview' 
                                 interview={this.props.interview} 
                                 parentEntryId={this.props.referenceType.registry_entry_id}
                                 locale={this.props.locale}
                                 goDeeper={true}
                                 //  allowed values: true, false, 'hidden'
                                 selectRegistryReferenceType={false}
                                 refTypeId={this.props.referenceType.id}
                             />
                })}
            >
                <i className="fa fa-plus"></i>
            </div>
        )
        } else {
            return null;
        }
    }

    render() {
        return (
            <p>
                <h4>{this.props.referenceType.name[this.props.locale]}:</h4>
                {this.registryEntries()}
                {this.addRegistryReference()}
            </p>
        )
    }
}

