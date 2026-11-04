import { useEffect } from 'react';

import { fetchData, getInstitutions, getStatuses } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Loads institutions through the current route and reads their existing Redux records.
 * Failed requests remain failed until explicitly refreshed, rather than retrying on render.
 * @param {Object} [options={}] - Request controls.
 * @param {boolean} [options.enabled=true] - Wait for the owning editor's authorization before fetching.
 * @returns {Object|undefined} Institution records by ID, absent before the first response.
 */
export function useGetInstitutions({ enabled = true } = {}) {
    const dispatch = useDispatch();
    const pathBase = usePathBase();
    const institutions = useSelector(getInstitutions);
    const statuses = useSelector(getStatuses);
    const status = statuses?.institutions?.all;

    useEffect(() => {
        if (enabled && (!status || /^reload/.test(status))) {
            dispatch(
                fetchData({ pathBase }, 'institutions', null, null, 'all', {
                    handleErrors: true,
                })
            );
        }
    }, [dispatch, pathBase, status, enabled]);

    return institutions;
}

export default useGetInstitutions;
