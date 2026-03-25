/* global railsMode */
import classNames from 'classnames';
import { getArchiveId } from 'modules/archive';
import { OHD_DOMAINS } from 'modules/constants';
import { clearStateData, getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { getIsLoggedIn, submitLogout } from 'modules/user';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function SessionButtons({ className }) {
    const { t, locale } = useI18n();
    const { projectId } = useProject();
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const archiveId = useSelector(getArchiveId);
    const projects = useSelector(getProjects);

    const loginURL = `${OHD_DOMAINS[railsMode]}/${locale}/users/sign_in?path=${location.pathname}${encodeURIComponent(location.search)}&project=${projectId}`;

    const handleRegisterClick = () => {
        // Store the current path for redirect after successful registration
        sessionStorage.setItem(
            'registrationReturnPath',
            location.pathname + location.search
        );
    };

    return isLoggedIn ? (
        <div className={classNames('SessionButtons', className)}>
            <Link to={`${pathBase}/users/current`}>{t('account_page')}</Link>
            <button
                type="button"
                className="Button Button--asLink u-ml-small"
                onClick={() => {
                    // clear non-public data
                    if (archiveId) {
                        dispatch(
                            clearStateData('interviews', archiveId, 'title')
                        );
                        dispatch(
                            clearStateData(
                                'interviews',
                                archiveId,
                                'short_title'
                            )
                        );
                        dispatch(
                            clearStateData(
                                'interviews',
                                archiveId,
                                'description'
                            )
                        );
                        dispatch(
                            clearStateData(
                                'interviews',
                                archiveId,
                                'observations'
                            )
                        );
                        dispatch(
                            clearStateData(
                                'interviews',
                                archiveId,
                                'translations_attributes'
                            )
                        );
                        dispatch(
                            clearStateData('interviews', archiveId, 'photos')
                        );
                        dispatch(
                            clearStateData('interviews', archiveId, 'segments')
                        );
                        dispatch(clearStateData('statuses', 'people'));
                        Object.keys(projects).map((pid) => {
                            dispatch(clearStateData('projects', pid, 'people'));
                        });
                    }
                    dispatch(clearStateData('users'));
                    dispatch(clearStateData('users'));
                    dispatch(submitLogout(`${pathBase}/users/sign_out`));
                }}
            >
                {t('logout')}
            </button>
        </div>
    ) : (
        <div className={classNames('SessionButtons', className)}>
            <Link
                to={`${pathBase}/register`}
                onClick={handleRegisterClick}
                data-testid="register-link"
            >
                {t('user.registration')}
            </Link>
            <a href={loginURL} className="u-ml-small" data-testid="login-link">
                {t('login')}
            </a>
        </div>
    );
}

SessionButtons.propTypes = {
    className: PropTypes.string,
};
