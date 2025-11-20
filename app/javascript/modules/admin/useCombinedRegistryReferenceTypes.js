import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';

import { fetcher } from 'modules/api';
import { getRegistryReferenceTypesForCurrentProject } from 'modules/data';
import { usePathBase, useProject } from 'modules/routes';

export default function useCombinedRegistryReferenceTypes() {
    const { isOhd } = useProject();
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
    } = useSWRImmutable(path, fetcher);

    let combinedRegistryReferenceTypes;
    if (isOhd) {
        combinedRegistryReferenceTypes = Object.values(
            projectRegistryReferenceTypes
        );
    } else {
        combinedRegistryReferenceTypes = Object.values(
            projectRegistryReferenceTypes
        ).concat(globalRegistryReferenceTypes || []);
    }

    return {
        isLoading,
        isValidating,
        registryReferenceTypes: combinedRegistryReferenceTypes,
        error,
    };
}
