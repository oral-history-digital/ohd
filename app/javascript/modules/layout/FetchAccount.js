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

    if (
        !isLoggedIn &&
        !checkedOhdSession &&
        location.origin !== OHD_DOMAINS[railsMode] &&
        ['za', 'mog', 'cd', 'campscapes'].indexOf(projectId) === -1
    ) {
        debugger
        location = `${OHD_DOMAINS[railsMode]}/de/user_accounts/sign_in?href=${location.href}`;
    } else if (
        !accountsStatus.current ||
        /^reload/.test(accountsStatus.current) ||
        (isLoggedIn && !account && !/^fetch/.test(accountsStatus.current))
    ) {
        fetchData({ projectId, locale, projects }, 'accounts', 'current');
    } else if (isLoggedOut && account) {
        deleteData({ projectId, locale, projects }, 'accounts', 'current', null, null, false, true);
    }

    return null;
}

