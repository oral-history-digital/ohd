import { getIsLoggedIn } from 'modules/user';
import { useSelector } from 'react-redux';

import { getEditView } from './selectors';

export default function useIsEditor() {
    const isLoggedIn = useSelector(getIsLoggedIn);
    const editView = useSelector(getEditView);

    return isLoggedIn && editView;
}
