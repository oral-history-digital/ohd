/* global railsMode */
import { useCallback } from 'react';

import classNames from 'classnames';
import { setProjectId } from 'modules/archive';
import { OHD_DOMAINS } from 'modules/constants';
import { getCurrentUser, getUmbrellaProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { getProjectLogoSrc } from 'modules/project-home';
import { useCurrentPage, useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function SiteLogo({ className }) {
    const { locale } = useI18n();
    const { project } = useProject();
    const dispatch = useDispatch();
    const currentAccount = useSelector(getCurrentUser);
    const umbrellaProject = useSelector(getUmbrellaProject);
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
    const logoSrc =
        getProjectLogoSrc(umbrellaProject, locale) || '/logo-ohd.svg';
    const logoTitle =
        umbrellaProject?.name?.[locale] ||
        umbrellaProject?.display_name?.[locale] ||
        'Oral-History.Digital';

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
