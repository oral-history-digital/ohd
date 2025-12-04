import { getEditView } from 'modules/archive';
import { getCurrentUser } from 'modules/data';
import { useProject } from 'modules/routes';
import { useSelector } from 'react-redux';

import originalAdmin from './admin';

export function useAuthorization() {
    const user = useSelector(getCurrentUser);
    const editView = useSelector(getEditView);
    const { project } = useProject();

    const curriedAdmin = (obj, action) =>
        originalAdmin({ user, project, editView }, obj, action);

    return { isAuthorized: curriedAdmin };
}
