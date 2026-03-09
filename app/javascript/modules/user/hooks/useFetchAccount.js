import { useEffect } from 'react';

import {
    deleteData,
    fetchData,
    getCurrentUser,
    getUsersStatus,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

import { getIsLoggedIn, getIsLoggedOut } from '../selectors';

export default function useFetchAccount() {
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUser);
    const usersStatus = useSelector(getUsersStatus);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const isLoggedOut = useSelector(getIsLoggedOut);

    const { project, projectId } = useProject();
    const { locale } = useI18n();

    useEffect(() => {
        if (
            /^reload/.test(usersStatus.current) ||
            (isLoggedIn && !user && !/^fetching/.test(usersStatus.current))
        ) {
            dispatch(
                fetchData({ projectId, locale, project }, 'users', 'current')
            );
        }
    }, [usersStatus.current, isLoggedIn]);

    useEffect(() => {
        if (isLoggedOut && user) {
            dispatch(
                deleteData(
                    { projectId, locale, project },
                    'users',
                    'current',
                    null,
                    null,
                    false,
                    true
                )
            );
        }
    }, [isLoggedOut]);
}
