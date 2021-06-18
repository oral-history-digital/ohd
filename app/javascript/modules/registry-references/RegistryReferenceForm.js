import { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default class RegistryReferenceForm extends Component {
    componentDidMount() {
        this.loadRegistryReferenceTypes();
    }

    componentDidUpdate() {
        this.loadRegistryReferenceTypes();
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus[`for_projects_${this.props.project?.id}`]) {
            this.props.fetchData(this.props, 'registry_reference_types', null, null, [`for_projects=${this.props.project?.id}`]);
        }
    }

    elements() {
        let elements = [
            {
                elementType: 'registryEntryTreeSelect',
                attribute: 'registry_entry_id',
                lowestAllowedRegistryEntryId: this.props.lowestAllowedRegistryEntryId,
                inTranscript: this.props.inTranscript,
                goDeeper: true
            },
        ]
        if (!this.props.inTranscript) {
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
        if (!this.props.registryReferenceTypeId) {
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
                    onSubmit={params => {
                        this.props.submitData(this.props, params);
                        this.props.closeArchivePopup();
                        this.props?.onSubmit();
                    }}
                    elements={this.elements()}
                />
            </div>
        );
    }
}

RegistryReferenceForm.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    registryReference: PropTypes.object,
    refObject: PropTypes.object,
    inTranscript: PropTypes.bool,
    registryReferenceTypes: PropTypes.object,
    registryReferenceTypeId: PropTypes.number,
    registryReferenceTypesStatus: PropTypes.string,
    lowestAllowedRegistryEntryId: PropTypes.number,
    interview: PropTypes.object,
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
};
