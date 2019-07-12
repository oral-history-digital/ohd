import React from 'react';

import RegistryReferenceFormContainer from '../containers/RegistryReferenceFormContainer';
import RegistryReferenceContainer from '../containers/RegistryReferenceContainer';
import { t, admin, getInterviewee } from '../../../lib/utils';

export default class MetadataRegistryReferenceType extends React.Component {

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
        let string = ''
        let string2 = ''
        switch(this.props.refObjectType) {
            case 'person':
                string = `references_for_person_${this.props.interview.interviewee_id}_type_id_${this.props.referenceType.id}`
                string2 = `references_for_person=${this.props.interview.interviewee_id}&type_id=${this.props.referenceType.id}`
                break
            case 'interview':
                string = `references_for_interview_${this.props.interview.archive_id}_type_id_${this.props.referenceType.id}`
                string2 = `references_for_interview=${this.props.interview.archive_id}&type_id=${this.props.referenceType.id}`
                break;
        }

        if (!this.props.registryEntriesStatus[string]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, string2);
        }
    }

    registryEntries() {
        let registryEntries = [];
        let string = ''
        switch(this.props.refObjectType) {
            case 'person':
                string = `references_for_person_${this.props.interview.interviewee_id}_type_id_${this.props.referenceType.id}`
                break
            case 'interview':
                string = `references_for_interview_${this.props.interview.archive_id}_type_id_${this.props.referenceType.id}`
                break
        }
        if (
            this.props.interview && 
            this.props.registryEntriesStatus[string] &&
            this.props.registryEntriesStatus[string].split('-')[0] === 'fetched'
        ) {
            for (var c in this.props.interview.registry_references) {  
                let registryReference = this.props.interview.registry_references[c];
                let registryEntry = this.props.registryEntries[registryReference.registry_entry_id];
                if (registryEntry && registryReference.registry_reference_type_id == this.props.referenceType.id) {
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
            if (registryEntries.length > 1) registryEntries.unshift(
                <br key={this.props.referenceType.id}/>
            )
        } 
        if (registryEntries.length > 0) {
        return registryEntries;
        } else if (!admin(this.props, {type: 'RegistryReference', action: 'create'})) {
            return (
                <span>---</span>
            )
        }
    }

    addRegistryReference() {
        if (admin(this.props, {type: 'RegistryReference', action: 'create'})) {
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
                <span className={'flyout-content-label'}>{this.props.referenceType.name[this.props.locale]}:</span>
                {this.registryEntries()}
                {this.addRegistryReference()}
            </p>
        )
    }
}

