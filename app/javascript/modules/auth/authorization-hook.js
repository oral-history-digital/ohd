import { useSelector } from 'react-redux';

import { getCurrentProject, getCurrentAccount } from 'modules/data';
import { getEditView } from 'modules/archive';

import originalAdmin from './admin';

export function useAuthorization() {
    const account = useSelector(getCurrentAccount);
    const project = useSelector(getCurrentProject);
    const editView = useSelector(getEditView);

    const curriedAdmin = (obj, action) => originalAdmin({ account, project, editView }, obj, action);

    return { isAuthorized: curriedAdmin };
}
