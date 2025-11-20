import { useSelector } from 'react-redux';

import { getChangePasswordStatus } from 'modules/user';

export default function AfterResetPassword({}) {
    const changePasswordStatus = useSelector(getChangePasswordStatus);

    if (
        changePasswordStatus?.success &&
        changePasswordStatus?.redirect_url !== location.href
    ) {
        location.href = changePasswordStatus.redirect_url;
    }

    return null;
}
