import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { usePrevious } from 'modules/react-toolbox';
import { getLocale, getProjectId } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { pathBase } from 'modules/routes';
import { getIsLoggedIn } from '../selectors';

export default function RedirectOnLogin({
    path,
}) {
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);
    const isLoggedIn = useSelector(getIsLoggedIn);

    const prevIsLoggedIn = usePrevious(isLoggedIn);
    const to = projectId ? `${pathBase({projectId, locale, project})}${path}` : `/${locale}`;

    if (prevIsLoggedIn === false && isLoggedIn === true) {
        return (
            <Navigate to={to} />
        );
    }

    return null;
}

RedirectOnLogin.propTypes = {
    path: PropTypes.string.isRequired,
};
