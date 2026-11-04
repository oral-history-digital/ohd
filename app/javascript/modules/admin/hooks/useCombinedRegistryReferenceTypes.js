import { fetcher } from 'modules/api';
import { getRegistryReferenceTypesForCurrentProject } from 'modules/data';
import { usePathBase, useProject } from 'modules/routes';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';

/**
 * Combines project and global reference types after the current project role is known.
 * @returns {Object} Visible reference types and combined project/resource request status.
 */
export default function useCombinedRegistryReferenceTypes() {
    const {
        project,
        isLoading: projectLoading,
        error: projectError,
    } = useProject({});
    const projectReady = Boolean(project && !projectLoading && !projectError);
    const projectRegistryReferenceTypes = useSelector(
        getRegistryReferenceTypesForCurrentProject
    );
    const pathBase = usePathBase();

    const path = `${pathBase}/registry_reference_types/global.json`;
    const {
        isLoading,
        isValidating,
        data: globalRegistryReferenceTypes,
        error,
    } = useSWRImmutable(projectReady ? path : null, fetcher);

    let combinedRegistryReferenceTypes;
    if (project?.is_umbrella) {
        combinedRegistryReferenceTypes = Object.values(
            projectRegistryReferenceTypes || {}
        );
    } else {
        combinedRegistryReferenceTypes = Object.values(
            projectRegistryReferenceTypes || {}
        ).concat(globalRegistryReferenceTypes || []);
    }

    return {
        isLoading: projectLoading || (!project && !projectError) || isLoading,
        isValidating: projectLoading || isValidating,
        registryReferenceTypes:
            projectReady && !error ? combinedRegistryReferenceTypes : [],
        error: projectError || error,
    };
}
