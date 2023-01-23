import { useSelector, useDispatch } from 'react-redux';

import { getLocale, getProjectId } from 'modules/archive';
import { fetchData, deleteData, getCurrentAccount, getProjects,
    getAccountsStatus, getCurrentProject } from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut } from 'modules/account';

export default function FetchAccount() {
    const dispatch = useDispatch();

    const account = useSelector(getCurrentAccount);
    const accountsStatus = useSelector(getAccountsStatus);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const isLoggedOut = useSelector(getIsLoggedOut);
    const projectId = useSelector(getProjectId);
    const projects = useSelector(getProjects);
    const locale = useSelector(getLocale);

    if (
        !accountsStatus.current ||
        accountsStatus.current.split('-')[0] === 'reload' ||
        (isLoggedIn && !account && accountsStatus.current.split('-')[0] === 'fetched')
    ) {
        dispatch(fetchData({ projectId, locale, projects }, 'accounts', 'current'));
    } else if (isLoggedOut && account) {
        dispatch(deleteData({ projectId, locale, projects }, 'accounts', 'current', null, null, false, true));
    }

    return null;
}

