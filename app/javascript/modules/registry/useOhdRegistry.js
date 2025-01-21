import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getOHDProject, getRegistryEntriesStatus, fetchData } from 'modules/data';

export default function useOHDRegistry() {

    const ohd = useSelector(getOHDProject);
    const registryEntriesStatus = useSelector(getRegistryEntriesStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!registryEntriesStatus[ohd.root_registry_entry_id]) {
            dispatch(fetchData({ locale: 'de', project: ohd}, 'registry_entries',
                null, null, `children_for_entry=${ohd.root_registry_entry_id}`));
        }
    }, [registryEntriesStatus[ohd.root_registry_entry_id]]);
}

