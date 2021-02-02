import { useSelector } from 'react-redux';

import { admin as originalAdmin } from 'lib/utils';
import { getCurrentAccount } from 'modules/data';
import { getEditView } from 'modules/archive';

export function useAuthorization() {
    const account = useSelector(getCurrentAccount);
    const editView = useSelector(getEditView);

    const curriedAdmin = (obj) => originalAdmin({ account, editView }, obj);

    return { isAuthorized: curriedAdmin };
}
