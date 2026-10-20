import { useEffect } from 'react';

import { fetchData, getInstitutions, getStatuses } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Loads institutions through the current route and reads their existing Redux records.
 * @returns {Object} Institution records by ID.
 */
export function useGetInstitutions() {
    const dispatch = useDispatch();
    const pathBase = usePathBase();
    const institutions = useSelector(getInstitutions);
    const statuses = useSelector(getStatuses);

    useEffect(() => {
        // Check if institutions for the current project have already been loaded before
        // dispatch fetchData if not, to avoid unnecessary API calls
        if (!statuses?.institution?.all) {
            dispatch(
                fetchData({ pathBase }, 'institutions', null, null, 'all')
            );
        }
    }, [dispatch, pathBase, statuses?.institution?.all]);

    return institutions;
}

export default useGetInstitutions;
