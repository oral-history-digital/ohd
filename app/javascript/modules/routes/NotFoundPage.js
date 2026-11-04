/* global railsMode */
import { OHD_DOMAINS } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import usePathBase from './usePathBase';

/**
 * Displays missing or denied pages with navigation to an accessible homepage.
 * @param {Object} props - Error display options.
 * @param {number} [props.status=404] - HTTP error status.
 * @param {boolean} [props.publicHome=false] - Link to the public portal instead of the current project.
 * @param {string} [props.projectShortname] - Project identifier for login navigation.
 * @returns {React.ReactElement} Error page.
 */
export default function NotFoundPage({
    status = 404,
    publicHome = false,
    projectShortname,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const home = `${OHD_DOMAINS[railsMode]}/${locale}`;
    const title =
        status === 403
            ? `${t('error')} 403`
            : t('modules.routes.not_found.title');

    return (
        <main
            className={publicHome ? 'Main' : 'wrapper-content register'}
            style={
                publicHome
                    ? {
                          minHeight: '100vh',
                          width: '100vw',
                          display: 'grid',
                          placeItems: 'center',
                      }
                    : undefined
            }
        >
            <Helmet>
                <title>{title}</title>
                {publicHome && <link rel="stylesheet" href="/error.css" />}
            </Helmet>
            <section
                className={publicHome ? 'Section Section--warning' : undefined}
            >
                <h1
                    className={
                        publicHome ? 'Section-heading' : 'Page-main-title'
                    }
                >
                    {title}
                </h1>
                <div className={publicHome ? 'Section-content' : undefined}>
                    <p className={publicHome ? undefined : 'Paragraph'}>
                        {t(
                            status === 403
                                ? 'unauthorized'
                                : 'modules.routes.not_found.description'
                        )}
                    </p>
                    {status === 403 && (
                        <p className={publicHome ? undefined : 'Paragraph'}>
                            <a
                                href={`${home}/users/sign_in?project=${encodeURIComponent(projectShortname || '')}&path=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                            >
                                {t('login')}
                            </a>
                        </p>
                    )}
                    <p className={publicHome ? undefined : 'Paragraph'}>
                        {publicHome ? (
                            <a href={home}>
                                {t('modules.routes.not_found.link')}
                            </a>
                        ) : (
                            <Link to={`${pathBase}`}>
                                {t('modules.routes.not_found.link')}
                            </Link>
                        )}
                    </p>
                </div>
            </section>
        </main>
    );
}

NotFoundPage.propTypes = {
    status: PropTypes.number,
    publicHome: PropTypes.bool,
    projectShortname: PropTypes.string,
};
