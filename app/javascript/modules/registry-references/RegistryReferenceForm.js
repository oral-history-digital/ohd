import { useEffect } from 'react';

import { fetcher, useRegistryReferenceApi } from 'modules/api';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import {
    useMutatePersonLandingPageMetadata,
    useMutatePersonWithAssociations,
} from 'modules/person';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import useSWRImmutable from 'swr/immutable';

/**
 * Creates or edits references using Redux project identity and entity-owned reference types.
 * Person mutations refresh both person representations; other references use Redux saves.
 *
 * @param {Object} props - Form properties.
 * @param {Object} [props.registryReference] - Existing reference; omit when creating.
 * @param {Object} [props.registryReferenceTypes] - Available reference types keyed by ID.
 * @param {Object} props.registryReferenceTypesStatus - Reference type request status.
 * @param {Object} [props.refObject] - Record receiving a new reference.
 * @param {Object} [props.interview] - Interview receiving a new reference.
 * @param {number} [props.registryReferenceTypeId] - Fixed reference type.
 * @param {number} [props.lowestAllowedRegistryEntryId] - Restricts the selectable registry tree.
 * @param {boolean} [props.inTranscript] - Limits type choices to transcript types.
 * @param {Function} props.fetchData - Loads reference types through Redux.
 * @param {Function} props.submitData - Saves non-person references through Redux.
 * @param {Function} [props.onSubmit] - Called after submitting the form.
 * @param {Function} [props.onCancel] - Closes the form without saving.
 * @returns {React.ReactElement} Reference form or its loading/error state.
 */
export default function RegistryReferenceForm({
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
    const { t } = useI18n();
    const {
        project,
        isLoading: projectIsLoading,
        error: projectError,
    } = useProject();
    const pathBase = usePathBase();
    const globalTypesPath =
        project &&
        !projectError &&
        !project.is_umbrella &&
        registryReferenceTypeId
            ? `${pathBase}/registry_reference_types/global.json`
            : null;
    const {
        data: globalTypes,
        isLoading: globalTypesAreLoading,
        error: globalTypesError,
    } = useSWRImmutable(globalTypesPath, fetcher);
    const loadUmbrellaTree =
        Boolean(registryReferenceTypeId) &&
        (project?.is_umbrella ||
            globalTypes?.some((type) => type.id === registryReferenceTypeId));
    const { createRegistryReference, updateRegistryReference } =
        useRegistryReferenceApi();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata =
        useMutatePersonLandingPageMetadata();

    useEffect(() => {
        if (
            project &&
            !projectError &&
            !registryReferenceTypesStatus[`for_projects_${project.id}`]
        ) {
            fetchData(
                { pathBase },
                'registry_reference_types',
                null,
                null,
                `for_projects=${project.id}`
            );
        }
    }, [
        project,
        projectError,
        registryReferenceTypesStatus,
        pathBase,
        fetchData,
    ]);

    /** @returns {Object[]} Tree selection and optional reference type fields. */
    function buildElements() {
        let elements = [
            {
                elementType: 'registryEntryTreeSelect',
                attribute: 'registry_entry_id',
                lowestAllowedRegistryEntryId,
                loadUmbrellaTree: Boolean(loadUmbrellaTree),
                inTranscript,
                goDeeper: true,
            },
        ];
        if (!registryReferenceTypeId) {
            elements.push({
                elementType: 'select',
                attribute: 'registry_reference_type_id',
                values: buildRegistryReferenceTypes(),
                value: registryReference?.registry_reference_type_id,
                withEmpty: true,
            });
        }

        return elements;
    }

    /** @returns {Object[]|undefined} Available types, limited to transcript types when needed. */
    function buildRegistryReferenceTypes() {
        if (registryReferenceTypes) {
            return inTranscript
                ? Object.values(registryReferenceTypes).filter(
                      (r) => r.use_in_transcript
                  )
                : Object.values(registryReferenceTypes);
        }
    }

    const error = projectError || (globalTypesPath ? globalTypesError : null);
    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (
        projectIsLoading ||
        !project ||
        (globalTypesPath && globalTypesAreLoading)
    )
        return <Spinner />;

    return (
        <div>
            <Form
                scope="registry_reference"
                data={registryReference}
                values={
                    !registryReference && {
                        ref_object_id: refObject.id,
                        ref_object_type: refObject.type,
                        interview_id: interview.id,
                        registry_reference_type_id:
                            registryReferenceTypeId || null,
                        // TODO: change following dummy-values with meaningful ones
                        ref_position: 1,
                        workflow_state: 'preliminary',
                    }
                }
                helpTextCode="registry_reference_form"
                onSubmit={async (params) => {
                    const refObjectType = refObject
                        ? refObject.type
                        : registryReference.ref_object_type;
                    const refObjectId = refObject
                        ? refObject.id
                        : registryReference.ref_object_id;

                    if (refObjectType === 'Person') {
                        // Person references use SWR, so mutate handles cache updates synchronously
                        mutatePersonWithAssociations(refObjectId, async () => {
                            const referenceData = {
                                ...params.registry_reference,
                            };
                            let result;
                            if ('id' in referenceData) {
                                const referenceId = referenceData.id;
                                delete referenceData.id;
                                result = await updateRegistryReference(
                                    referenceId,
                                    referenceData
                                );
                            } else {
                                result =
                                    await createRegistryReference(
                                        referenceData
                                    );
                            }
                            mutatePersonLandingPageMetadata(refObjectId);

                            return result;
                        });
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    } else {
                        // Segment references use Redux. Form is already closed by parent,
                        // so callback is just for cleanup if needed.
                        submitData({ pathBase }, params, {}, onSubmit);
                    }
                }}
                onCancel={onCancel}
                elements={buildElements()}
            />
        </div>
    );
}

RegistryReferenceForm.propTypes = {
    registryReference: PropTypes.object,
    refObject: PropTypes.object,
    inTranscript: PropTypes.bool,
    registryReferenceTypes: PropTypes.object,
    registryReferenceTypeId: PropTypes.number,
    registryReferenceTypesStatus: PropTypes.object.isRequired,
    lowestAllowedRegistryEntryId: PropTypes.number,
    interview: PropTypes.object,
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
