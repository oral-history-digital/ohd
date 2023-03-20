import { useSelector } from 'react-redux';

import { getCurrentProject, getCurrentUser } from 'modules/data';
import { getEditView } from 'modules/archive';

import originalAdmin from './admin';

export function useAuthorization() {
    const user = useSelector(getCurrentUser);
    const project = useSelector(getCurrentProject);
    const editView = useSelector(getEditView);

    const curriedAdmin = (obj, action) => originalAdmin({ user, project, editView }, obj, action);

    return { isAuthorized: curriedAdmin };
}
