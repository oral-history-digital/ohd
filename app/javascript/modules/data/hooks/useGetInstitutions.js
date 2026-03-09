import { useEffect } from 'react';

import { fetchData, getInstitutions, getStatuses } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

export function useGetInstitutions() {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    const { project, projectId } = useProject();
    const institutions = useSelector(getInstitutions);
    const statuses = useSelector(getStatuses);

    useEffect(() => {
        // Check if institutions for the current project have already been loaded before
        // dispatch fetchData if not, to avoid unnecessary API calls
        if (!statuses?.institution?.all) {
            dispatch(
                fetchData(
                    { locale, project, projectId },
                    'institutions',
                    null,
                    null,
                    'all'
                )
            );
        }
    }, [dispatch, locale, project, projectId, statuses?.institution?.all]);

    return institutions;
}

export default useGetInstitutions;
