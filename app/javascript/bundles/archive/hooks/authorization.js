import { useSelector } from 'react-redux';

import { admin as originalAdmin } from 'lib/utils';
import { getCurrentAccount } from '../selectors/dataSelectors';
import { getEditView } from '../selectors/archiveSelectors';

export function useAuthorization() {
    const account = useSelector(getCurrentAccount);
    const editView = useSelector(getEditView);

    const curriedAdmin = (obj) => originalAdmin({ account, editView }, obj);

    return { isAuthorized: curriedAdmin };
}
