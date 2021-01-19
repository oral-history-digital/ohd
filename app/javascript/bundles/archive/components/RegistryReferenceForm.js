import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegistryReferenceForm extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.loadRegistryReferenceTypes();
    }

    componentDidUpdate() {
        this.loadRegistryReferenceTypes();
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus) {
            this.props.fetchData(this.props, 'registry_reference_types');
        }
    }
    
    elements() {
        let _this = this;
        let elements = [
            {
                elementType: 'registryEntrySelect',
                attribute: 'registry_entry_id',
                lowestAllowedRegistryEntryId: this.props.lowestAllowedRegistryEntryId,
                inTranscript: this.props.inTranscript,
                goDeeper: true
            },
        ]
        if (!_this.props.inTranscript) {
            elements.push(
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: ['preliminary', 'checked', 'rejected'],
                    value: this.props.registryReference && this.props.registryReference.workflow_state,
                    optionsScope: 'workflow_states',
                }
            )
        }
        if (!_this.props.registryReferenceTypeId) {
            elements.push(
                {
                    elementType: 'select',
                    attribute: 'registry_reference_type_id',
                    values: this.registryReferenceTypes(),
                    value: this.props.registryReference && this.props.registryReference.registry_reference_type_id,
                    withEmpty: true,
                }
            )
        }
        return elements;
    }

    registryReferenceTypes() {
        if (this.props.registryReferenceTypes) {
            return this.props.inTranscript ?
                Object.values(this.props.registryReferenceTypes).filter(r => r.use_in_transcript) :
                Object.values(this.props.registryReferenceTypes);
        }
    }

    render() {
        let _this = this;
        return (
            <div>
                <Form 
                    scope='registry_reference'
                    data={this.props.registryReference}
                    values={!this.props.registryReference && {
                        ref_object_id: this.props.refObject.id,
                        ref_object_type: this.props.refObject.type,
                        interview_id: this.props.interview.id,
                        registry_reference_type_id: this.props.registryReferenceTypeId || null,
                        // TODO: change following dummy-values with meaningfull ones
                        ref_position: 1,
                        workflow_state: 'preliminary'
                    }}
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    elements={_this.elements()}
                />
            </div>
        );
    }
}
