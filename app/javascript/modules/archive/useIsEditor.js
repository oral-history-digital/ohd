import { useSelector } from 'react-redux';

import { getEditView } from 'modules/archive';
import { getIsLoggedIn } from 'modules/user';

export default function useIsEditor() {
    const isLoggedIn = useSelector(getIsLoggedIn);
    const editView = useSelector(getEditView);

    return isLoggedIn && editView;
}
