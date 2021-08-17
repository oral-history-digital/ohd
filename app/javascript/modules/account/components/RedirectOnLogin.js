import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { usePrevious } from 'modules/react-toolbox';
import { getLocale, getProjectId } from 'modules/archive';
import { getProjects } from 'modules/data';
import { pathBase } from 'modules/routes';
import { getIsLoggedIn } from '../selectors';

export default function RedirectOnLogin({
    path,
}) {
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const projects = useSelector(getProjects);
    const isLoggedIn = useSelector(getIsLoggedIn);

    const prevIsLoggedIn = usePrevious(isLoggedIn);
    const to = projectId ? `${pathBase({projectId, locale, projects})}${path}` : `/${locale}`;

    if (prevIsLoggedIn === false && isLoggedIn === true) {
        return (
            <Redirect to={to} />
        );
    }

    return null;
}

RedirectOnLogin.propTypes = {
    path: PropTypes.string.isRequired,
};
