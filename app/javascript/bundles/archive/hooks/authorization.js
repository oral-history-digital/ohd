import { useSelector } from 'react-redux';

import { admin as originalAdmin } from 'lib/utils';

export function useAuthorization() {
    const account = useSelector(state => state.data.accounts.current);
    const editView = useSelector(state => state.archive.editView);

    const curriedAdmin = (obj) => originalAdmin({ account, editView }, obj);

    return { isAuthorized: curriedAdmin };
}
