import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useRegistryReferenceApi } from 'modules/api';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useMutatePersonWithAssociations, useMutatePersonLandingPageMetadata } from 'modules/person';
import { useProject } from 'modules/routes';

export default function RegistryReferenceForm({
    ohdProject,
    registryReference,
    registryReferenceTypes,
    registryReferenceTypesStatus,
    refObject,
    interview,
    registryReferenceTypeId,
    lowestAllowedRegistryEntryId,
    inTranscript,
    fetchData,
    submitData,
    onSubmit,
    onCancel,
}) {
    const { locale } = useI18n();
    const { project, projectId } = useProject();
    const { createRegistryReference, updateRegistryReference } = useRegistryReferenceApi();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata = useMutatePersonLandingPageMetadata();

    useEffect(() => {
        if (!registryReferenceTypesStatus[`for_projects_${project?.id}`]) {
            fetchData({ locale, projectId, project }, 'registry_reference_types', null, null, `for_projects=${project?.id}`);
        }
    })

    function isOhdRegistryReferenceType() {
        const ohdRegistryReferenceTypes = Object.keys(ohdProject.registry_reference_types);
        const result = ohdRegistryReferenceTypes.includes(String(registryReferenceTypeId));
        return result;
    }

    function buildElements() {
        let elements = [
            {
                elementType: 'registryEntryTreeSelect',
                attribute: 'registry_entry_id',
                lowestAllowedRegistryEntryId,
                loadOhdTree: isOhdRegistryReferenceType(),
                inTranscript,
                goDeeper: true
            },
        ]
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
                helpTextCode="registry_reference_form"
                onSubmit={async params => {
                    const refObjectType = refObject ? refObject.type : registryReference.ref_object_type;
                    const refObjectId = refObject ? refObject.id : registryReference.ref_object_id;

                    if (refObjectType === 'Person') {
                        mutatePersonWithAssociations(refObjectId, async () => {
                            const referenceData = {...params.registry_reference};
                            let result;
                            if ('id' in referenceData) {
                                const referenceId = referenceData.id;
                                delete referenceData.id;
                                result = await updateRegistryReference(referenceId, referenceData);
                            } else {
                                result = await createRegistryReference(referenceData);
                            }
                            mutatePersonLandingPageMetadata(refObjectId);

                            return result;
                        });
                    } else {
                        submitData({ locale, projectId, project }, params);
                    }

                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                elements={buildElements()}
            />
        </div>
    );
}

RegistryReferenceForm.propTypes = {
    ohdProject: PropTypes.object.isRequired,
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
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
