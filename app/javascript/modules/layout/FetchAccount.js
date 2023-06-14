import { useEffect } from 'react';

import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { OHD_DOMAINS } from 'modules/constants';

export default function FetchAccount({
    user,
    usersStatus,
    isLoggedIn,
    isLoggedOut,
    checkedOhdSession,
    fetchData,
    deleteData,
}) {
    const { project, projectId } = useProject();
    const { locale } = useI18n();

    useEffect(() => {
        if (
            !isLoggedIn &&
            !checkedOhdSession &&
            location.origin !== OHD_DOMAINS[railsMode] &&
            ['za', 'mog', 'cd', 'campscapes'].indexOf(projectId) === -1 &&
            /password/.test(location.pathname) === false &&
            /open_register_popup/.test(location.search) === false
        ) {
            location = `${OHD_DOMAINS[railsMode]}/de/users/is_logged_in?path=${location.pathname}&project=${projectId}`;
        }
    }, [checkedOhdSession, isLoggedIn]);

    useEffect(() => {
        if (
            /^reload/.test(usersStatus.current) ||
            (isLoggedIn && !user && !/^fetching/.test(usersStatus.current))
        ) {
            fetchData({ projectId, locale, project }, 'users', 'current');
        }
    }, [usersStatus.current, isLoggedIn]);


    useEffect(() => {
        if (isLoggedOut && user) {
            deleteData({ projectId, locale, project }, 'users', 'current', null, null, false, true);
        }
    }, [isLoggedOut]);

    return null;
}
