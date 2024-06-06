import { useSelector } from 'react-redux';

import { getIsLoggedIn } from 'modules/user';
import { getEditView } from './selectors';

export default function useIsEditor() {
    const isLoggedIn = useSelector(getIsLoggedIn);
    const editView = useSelector(getEditView);

    return isLoggedIn && editView;
}
