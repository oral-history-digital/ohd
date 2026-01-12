import { getCurrentUser } from 'modules/data';
import { useSelector } from 'react-redux';

import PasskeyPopup from './PasskeyPopup';

export default function AfterEnablePasskeyPopup({}) {
    const user = useSelector(getCurrentUser);

    const recentlyEnabledPasskey =
        user &&
        new Date(user.changed_to_passkey_at).getTime() + 60000 > Date.now();

    if (!user || !recentlyEnabledPasskey) return null;

    return <PasskeyPopup />;
}
