/* global railsMode */
import { useCallback } from 'react';

import classNames from 'classnames';
import { setProjectId } from 'modules/archive';
import { OHD_DOMAINS } from 'modules/constants';
import {
    getCurrentUser,
    getProjectBrandName,
    useUmbrellaProject,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useCurrentPage, useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

/**
 * Links to the umbrella homepage using its localized display name and selected logo.
 * @param {Object} props - Logo styling.
 * @param {string} [props.className] - Additional link classes.
 * @returns {React.ReactElement|false} Umbrella navigation logo when enabled.
 */
function SiteLogo({ className }) {
    const { locale } = useI18n();
    const { project } = useProject({});
    const dispatch = useDispatch();
    const currentAccount = useSelector(getCurrentUser);
    const { project: umbrellaProject } = useUmbrellaProject();
    const currentPage = useCurrentPage();
    const isHome = currentPage.pageType === 'site_startpage';

    const accessTokenParam = currentAccount?.access_token
        ? `access_token=${currentAccount.access_token}`
        : null;

    const unsetProjectId = useCallback(
        () => dispatch(setProjectId(null)),
        [dispatch]
    );

    const targetUrl = project?.archive_domain
        ? `${OHD_DOMAINS[railsMode]}/${locale}${
              accessTokenParam ? `?${accessTokenParam}` : ''
          }`
        : `/${locale}`;

    const displayLogo = project?.display_ohd_link || isHome;
    const logoSrc = umbrellaProject?.logo?.url || '/logo-ohd.svg';
    const logoTitle = getProjectBrandName(umbrellaProject, locale);

    return (
        displayLogo && (
            <div className="SiteHeader-homeLink">
                <Link
                    to={targetUrl}
                    title={logoTitle}
                    onClick={unsetProjectId}
                    className={classNames(className, 'u-mr')}
                    data-testid="SiteLogo-link"
                >
                    <img
                        className="SiteHeader-logo"
                        src={logoSrc}
                        alt={logoTitle}
                    />
                </Link>
            </div>
        )
    );
}

export default SiteLogo;

SiteLogo.propTypes = {
    className: PropTypes.string,
};
