import { useSelector } from 'react-redux';

import TwoFAPopup from './TwoFAPopup';
import { getCurrentUser } from 'modules/data';

export default function AfterEnable2FAPopup ({}) {
    const user = useSelector(getCurrentUser);

    //const recentlyEnabled2FA = true;
    const recentlyEnabled2FA = user &&
        new Date(user.changed_to_otp_at).getTime() + 60000 > Date.now();

    if (!user || !recentlyEnabled2FA) return null;

    return <TwoFAPopup />;
}

