import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { getArchiveId } from 'modules/archive';
import { OHD_DOMAINS } from 'modules/constants';
import { getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject, usePathBase } from 'modules/routes';
import { RegisterPopupLink, getIsLoggedIn, submitLogout } from 'modules/user';

export default function SessionButtons({ className }) {
    const { t, locale } = useI18n();
    const { projectId } = useProject();
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const archiveId = useSelector(getArchiveId);
    const projects = useSelector(getProjects);

    const loginURL = `${OHD_DOMAINS[railsMode]}/${locale}/users/sign_in?path=${location.pathname}${encodeURIComponent(location.search)}&project=${projectId}`;

    return isLoggedIn ? (
        <div className={classNames('SessionButtons', className)}>
            <a href={`${pathBase}/users/current`}>
                {t('account_page')}
            </a>
            <button
                type="button"
                className="Button Button--asLink u-ml-small"
                onClick={() => {
                    dispatch(submitLogout(`${pathBase}/users/sign_out`));
                }}
            >
                {t('logout')}
            </button>
        </div>
    ) : (
        <div className={classNames('SessionButtons', className)}>
            <RegisterPopupLink />
            <a href={loginURL} className="u-ml-small">{t('login')}</a>
        </div>
    );
}

SessionButtons.propTypes = {
    className: PropTypes.string,
};
