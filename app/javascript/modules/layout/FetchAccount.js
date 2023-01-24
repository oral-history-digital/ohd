import { OHD_DOMAINS } from 'modules/layout';

export default function FetchAccount({
    account,
    accountsStatus,
    isLoggedIn,
    isLoggedOut,
    projectId,
    projects,
    locale,
    fetchData,
    deleteData,
}) {

    if (!isLoggedIn && window.location !== OHD_DOMAINS[railsMode]) {
        window.location = `${OHD_DOMAINS[railsMode]}/de/accounts/access_token?href=${location.href}`;
    } else if (
        !accountsStatus.current ||
        /^reload/.test(accountsStatus.current) ||
        (isLoggedIn && !account && /^fetched/.test(accountsStatus.current))
    ) {
        fetchData({ projectId, locale, projects }, 'accounts', 'current');
    } else if (isLoggedOut && account) {
        deleteData({ projectId, locale, projects }, 'accounts', 'current', null, null, false, true);
    }

    return null;
}

