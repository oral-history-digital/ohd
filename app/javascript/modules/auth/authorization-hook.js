import { useSelector } from 'react-redux';

import { getCurrentAccount } from 'modules/data';
import { getEditView } from 'modules/archive';

import originalAdmin from './admin';

export function useAuthorization() {
    const account = useSelector(getCurrentAccount);
    const editView = useSelector(getEditView);

    const curriedAdmin = (obj) => originalAdmin({ account, editView }, obj);

    return { isAuthorized: curriedAdmin };
}