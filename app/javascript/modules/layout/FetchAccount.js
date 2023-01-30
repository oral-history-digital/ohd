import { useEffect } from 'react';

import { OHD_DOMAINS } from 'modules/layout';

export default function FetchAccount({
    account,
    accountsStatus,
    isLoggedIn,
    isLoggedOut,
    checkedOhdSession,
    projectId,
    projects,
    locale,
    fetchData,
    deleteData,
}) {

    useEffect(() => {
        if (
            !isLoggedIn &&
            !checkedOhdSession &&
            location.origin !== OHD_DOMAINS[railsMode] &&
            ['za', 'mog', 'cd', 'campscapes'].indexOf(projectId) === -1
        ) {
            location = `${OHD_DOMAINS[railsMode]}/de/user_accounts/is_logged_in?href=${location.href}`;
        }
    }, [checkedOhdSession, isLoggedIn]);

    useEffect(() => {
        if (
            /^reload/.test(accountsStatus.current) ||
            (isLoggedIn && !account && !/^fetching/.test(accountsStatus.current))
        ) {
            fetchData({ projectId, locale, projects }, 'accounts', 'current');
        }
    }, [accountsStatus.current, isLoggedIn]);


    useEffect(() => {
        if (isLoggedOut && account) {
            deleteData({ projectId, locale, projects }, 'accounts', 'current', null, null, false, true);
        }
    }, [isLoggedOut]);

    return null;
}

