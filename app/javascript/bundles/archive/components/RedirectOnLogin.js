import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { usePrevious } from '../hooks/misc';
import { getLocale, getProjectId } from '../selectors/archiveSelectors';
import { getIsLoggedIn } from '../selectors/accountSelectors';

import { pathBase } from 'lib/utils';

export default function RedirectOnLogin({
    path,
}) {
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const prevIsLoggedIn = usePrevious(isLoggedIn);

    if (prevIsLoggedIn === false && isLoggedIn === true) {
        return (
            <Redirect to={`/${pathBase({projectId, locale})}${path}`} />
        );
    }

    return null;
}
