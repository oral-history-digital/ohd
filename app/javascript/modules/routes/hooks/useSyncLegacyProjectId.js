import { useEffect } from 'react';

import { getProjectId, setProjectId } from 'modules/archive';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Transitional bridge to keep legacy archive.projectId (shortname)
 * aligned with the central current-project resolver.
 */
export function useSyncLegacyProjectId(projectShortname) {
    const dispatch = useDispatch();
    const legacyProjectId = useSelector(getProjectId);

    useEffect(() => {
        if (!projectShortname || projectShortname === legacyProjectId) {
            return;
        }

        dispatch(setProjectId(projectShortname));
    }, [dispatch, legacyProjectId, projectShortname]);
}

export default useSyncLegacyProjectId;
