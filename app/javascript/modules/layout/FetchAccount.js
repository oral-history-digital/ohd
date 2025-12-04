import { useEffect } from 'react';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function FetchAccount({
    user,
    usersStatus,
    isLoggedIn,
    isLoggedOut,
    fetchData,
    deleteData,
}) {
    const { project, projectId } = useProject();
    const { locale } = useI18n();

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
            deleteData(
                { projectId, locale, project },
                'users',
                'current',
                null,
                null,
                false,
                true
            );
        }
    }, [isLoggedOut]);

    return null;
}
