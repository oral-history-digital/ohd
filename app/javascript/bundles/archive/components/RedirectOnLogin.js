import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { usePrevious } from '../hooks/misc';
import { getLocale } from '../selectors/archiveSelectors';
import { getIsLoggedIn } from '../selectors/accountSelectors';

export default function RedirectOnLogin({
    path,
}) {
    const locale = useSelector(getLocale);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const prevIsLoggedIn = usePrevious(isLoggedIn);

    if (prevIsLoggedIn === false && isLoggedIn === true) {
        return (
            <Redirect to={`/${locale}${path}`} />
        );
    }

    return null;
}
