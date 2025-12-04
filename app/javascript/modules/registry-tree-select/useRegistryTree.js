import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

import createRegistryTree from './createRegistryTree';

export default function useRegistryTree(loadOhdTree, selectedRegistryEntryId) {
    const pathBase = usePathBase();

    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path(),
        fetcher
    );

    const registryTree = createRegistryTree(data, selectedRegistryEntryId);

    return { isLoading, isValidating, data: registryTree, error };

    function path() {
        let result;
        if (loadOhdTree) {
            result = `${pathBase}/global_registry_entry_tree.json`;
        } else {
            result = `${pathBase}/registry_entry_tree.json`;
        }
        return result;
    }
}
