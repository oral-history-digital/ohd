import { useEffect } from 'react';

import {
    clearStateData,
    fetchData,
    getCurrentUser,
    getUsersStatus,
} from 'modules/data';
import { usePathBase } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

import { getIsLoggedIn, getIsLoggedOut } from '../selectors';

/**
 * Loads the current account through the route's locale/project path without waiting
 * for project details. Logout clears the local account without sending a request.
 */
export default function useFetchAccount() {
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUser);
    const { current: accountStatus } = useSelector(getUsersStatus);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const isLoggedOut = useSelector(getIsLoggedOut);

    const pathBase = usePathBase();

    useEffect(() => {
        if (
            /^reload/.test(accountStatus) ||
            (isLoggedIn && !user && !/^fetching/.test(accountStatus))
        ) {
            dispatch(fetchData({ pathBase }, 'users', 'current'));
        }
    }, [dispatch, accountStatus, isLoggedIn, user, pathBase]);

    useEffect(() => {
        if (isLoggedOut && user) {
            dispatch(clearStateData('users', 'current'));
        }
    }, [dispatch, isLoggedOut, user]);
}
