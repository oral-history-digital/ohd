import { getEditView } from 'modules/archive';
import { getCurrentUser } from 'modules/data';
import { useProject } from 'modules/routes';
import { useSelector } from 'react-redux';

import originalAdmin from './admin';

/**
 * Checks existing role/task permissions against successfully loaded current project details.
 * @returns {{isAuthorized: Function}} Permission check that denies access while project data is unavailable.
 */
export function useAuthorization() {
    const user = useSelector(getCurrentUser);
    const editView = useSelector(getEditView);
    const { project, isLoading, error } = useProject();

    const curriedAdmin = (obj, action) =>
        Boolean(
            project &&
                !isLoading &&
                !error &&
                originalAdmin({ user, project, editView }, obj || {}, action)
        );

    return { isAuthorized: curriedAdmin };
}
