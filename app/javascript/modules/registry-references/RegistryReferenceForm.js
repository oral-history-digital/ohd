import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function RegistryReferenceForm({
    registryReference,
    registryReferenceTypes,
    registryReferenceTypesStatus,
    refObject,
    project,
    interview,
    projectId,
    projects,
    locale,
    registryReferenceTypeId,
    lowestAllowedRegistryEntryId,
    inTranscript,
    fetchData,
    submitData,
    closeArchivePopup,
    onSubmit,
}) {
    useEffect(() => {
        if (!registryReferenceTypesStatus[`for_projects_${project?.id}`]) {
            fetchData({ locale, projectId, projects }, 'registry_reference_types', null, null, `for_projects=${project?.id}`);
        }
    })

    function buildElements() {
        let elements = [
            {
                elementType: 'registryEntryTreeSelect',
                attribute: 'registry_entry_id',
                lowestAllowedRegistryEntryId,
                inTranscript,
                goDeeper: true
            },
        ]
        if (!inTranscript) {
            elements.push(
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: ['preliminary', 'checked', 'rejected'],
                    value: registryReference?.workflow_state,
                    optionsScope: 'workflow_states',
                }
            )
        }
        if (!registryReferenceTypeId) {
            elements.push(
                {
                    elementType: 'select',
                    attribute: 'registry_reference_type_id',
                    values: buildRegistryReferenceTypes(),
                    value: registryReference?.registry_reference_type_id,
                    withEmpty: true,
                }
            )
        }

        return elements;
    }

    function buildRegistryReferenceTypes() {
        if (registryReferenceTypes) {
            return inTranscript ?
                Object.values(registryReferenceTypes).filter(r => r.use_in_transcript) :
                Object.values(registryReferenceTypes);
        }
    }

    return (
        <div>
            <Form
                scope='registry_reference'
                data={registryReference}
                values={!registryReference && {
                    ref_object_id: refObject.id,
                    ref_object_type: refObject.type,
                    interview_id: interview.id,
                    registry_reference_type_id: registryReferenceTypeId || null,
                    // TODO: change following dummy-values with meaningful ones
                    ref_position: 1,
                    workflow_state: 'preliminary'
                }}
                onSubmit={params => {
                    submitData({ locale, projectId, projects }, params);
                    closeArchivePopup();
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                elements={buildElements()}
            />
        </div>
    );
}

RegistryReferenceForm.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
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
