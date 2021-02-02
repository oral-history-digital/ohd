import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { usePrevious } from 'bundles/archive/hooks/misc';
import { getLocale, getProjectId } from 'modules/archive';
import { pathBase } from 'lib/utils';
import { getIsLoggedIn } from '../selectors';

export default function RedirectOnLogin({
    path,
}) {
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const isLoggedIn = useSelector(getIsLoggedIn);

    const prevIsLoggedIn = usePrevious(isLoggedIn);

    if (prevIsLoggedIn === false && isLoggedIn === true) {
        return (
            <Redirect to={`${pathBase({projectId, locale})}${path}`} />
        );
    }

    return null;
}

RedirectOnLogin.propTypes = {
    path: PropTypes.string.isRequired,
};
