import { useEffect } from 'react';

import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import { getCurrentInterview, getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { underscore } from 'modules/strings';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import RegistryReferencesContainer from './RegistryReferencesContainer';

/**
 * Shows configured registry reference fields for a person or interview.
 * Loads project metadata and registry configuration through Redux, preserving access-based visibility.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} [props.editView] - Shows configured fields even without existing references.
 * @param {Function} props.fetchData - Dispatches legacy registry entry requests.
 * @param {Object} props.refObject - Record whose references are displayed.
 * @param {Object} props.registryEntriesStatus - Registry entry and query request status.
 * @returns {React.ReactNode} Reference fields or their project loading/error state.
 */
export default function SelectedRegistryReferences({
    editView,
    fetchData,
    refObject,
    registryEntriesStatus,
}) {
    const { t, locale } = useI18n();
    const { project, isLoading, error } = useProject({
        include: ['metadata_fields', 'registry_configuration'],
    });
    const pathBase = usePathBase();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const { isAuthorized } = useAuthorization();
    const user = useSelector(getCurrentUser);
    const interview = useSelector(getCurrentInterview);

    useEffect(() => {
        if (!project || error) return;

        const queryStatus =
            registryEntriesStatus[
                `ref_object_type_${refObject.type}_ref_object_id_${refObject.id}`
            ];
        if (!queryStatus) {
            fetchData(
                { pathBase },
                'registry_entries',
                null,
                null,
                `ref_object_type=${refObject.type}&ref_object_id=${refObject.id}`
            );
        }

        const rootId = project.root_registry_entry_id;
        const rootStatus = registryEntriesStatus[rootId];
        if (rootId && (!rootStatus || rootStatus.split('-')[0] === 'reload')) {
            fetchData({ pathBase }, 'registry_entries', rootId);
        }
    }, [
        project,
        error,
        pathBase,
        refObject.type,
        refObject.id,
        registryEntriesStatus,
        fetchData,
    ]);

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
    if (isLoading || !project) return <Spinner />;

    const hasInterviewPermission =
        interview?.workflow_state === 'public' ||
        isAuthorized(interview, 'show') ||
        (interview?.workflow_state === 'restricted' &&
            user?.interview_permissions?.some(
                (perm) => perm.interview_id === interview.id
            ));

    const fields = project.metadata_fields
        .filter((field) => field.registry_entry_id)
        .filter((field) => field.ref_object_type === refObject.type)
        .filter(
            (field) =>
                (field.display_on_landing_page &&
                    (!projectAccessGranted || !hasInterviewPermission)) ||
                (field.use_in_details_view &&
                    projectAccessGranted &&
                    hasInterviewPermission)
        );

    return fields.map((field) => {
        if (
            editView ||
            (refObject.registry_references &&
                Object.values(refObject.registry_references).find(
                    (r) =>
                        r.registry_reference_type_id ===
                        field.registry_reference_type_id
                ))
        ) {
            return (
                <div key={field.id} className="RegistryReferences u-mb-small">
                    <span className="RegistryReferences-label flyout-content-label">
                        {field.label ||
                            t(
                                `activerecord.attributes.${underscore(refObject.type)}.${field.name}`
                            )}
                        :
                    </span>
                    <RegistryReferencesContainer
                        refObject={refObject}
                        lowestAllowedRegistryEntryId={
                            field.registry_entry_id ||
                            project.root_registry_entry_id
                        }
                        registryReferenceTypeId={
                            field.registry_reference_type_id
                        }
                        locale={locale}
                    />
                </div>
            );
        } else {
            return null;
        }
    });
}

SelectedRegistryReferences.propTypes = {
    editView: PropTypes.bool,
    fetchData: PropTypes.func.isRequired,
    refObject: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
};
