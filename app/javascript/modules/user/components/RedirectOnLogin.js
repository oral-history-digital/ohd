import { getLocale, getProjectId } from 'modules/archive';
import { usePrevious } from 'modules/react-toolbox';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { getIsLoggedIn } from '../selectors';

/**
 * Redirects after login using the current route, keeping the umbrella homepage fallback.
 * @param {Object} props - Redirect settings.
 * @param {string} props.path - Project-relative destination after login.
 * @returns {React.ReactElement|null} Redirect on a login transition, otherwise nothing.
 */
export default function RedirectOnLogin({ path }) {
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const pathBase = usePathBase();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const prevIsLoggedIn = usePrevious(isLoggedIn);
    const to = projectId ? `${pathBase}${path}` : `/${locale}`;

    if (prevIsLoggedIn === false && isLoggedIn === true) {
        return <Navigate to={to} />;
    }

    return null;
}

RedirectOnLogin.propTypes = {
    path: PropTypes.string.isRequired,
};
