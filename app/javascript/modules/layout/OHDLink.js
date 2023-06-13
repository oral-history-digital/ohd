import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { getCurrentUser } from 'modules/data';
import { setProjectId } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { OHD_DOMAINS } from 'modules/constants';

function OHDLink({ className }) {
    const { locale } = useI18n();
    const { project } = useProject();
    const dispatch = useDispatch();
    const currentAccount = useSelector(getCurrentUser);

    const accessTokenParam = currentAccount?.access_token ? `access_token=${currentAccount.access_token}` : null;

    const unsetProjectId = useCallback(
        () => dispatch(setProjectId(null)),
        [dispatch]
    )

    return (
        project.display_ohd_link ?
            (project.archive_domain ?
                <a
                    title='OHD'
                    href={`${OHD_DOMAINS[railsMode]}/${locale}` + (!!accessTokenParam ? `?${accessTokenParam}` : '')}
                    className={classNames(className, 'u-mr')}
                >
                    <img className="SiteHeader-logo" src='/ohd-logo-gr.png' alt="" />
                </a> :
                <Link
                    to={`/${locale}`}
                    title='OHD'
                    onClick={unsetProjectId}
                    className={classNames(className, 'u-mr')}
                >
                    <img className="SiteHeader-logo" src='/ohd-logo-gr.png' alt="" />
                </Link>
            ) :
            null
    );
}

export default OHDLink;
