import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

import { useProject, usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import ProjectFooter from './ProjectFooter';
import { OHD_DOMAINS, GITHUB_URL } from 'modules/constants';

function SiteFooter() {
    const { project, projectId } = useProject();
    const pathBase = usePathBase();
    const { t, locale } = useI18n();

    const links = project.external_links || {};
    const sponsorLogos = project.sponsor_logos || [];

    return (
        <footer>
            <ul className="footer-bottom-nav">
                {!project.grant_project_access_instantly &&
                    !project.grant_access_without_login && (
                        <li>
                            <Link
                                to={`${pathBase}/conditions`}
                                title={`${t('conditions')} (${projectId})`}
                            >
                                {`${t('conditions')} (${projectId})`}
                            </Link>
                        </li>
                    )}
                {
                    <li>
                        <a
                            href={`${OHD_DOMAINS[railsMode]}/${locale}/conditions`}
                            target="_blank"
                            rel="noreferrer"
                            title={`${t('conditions')} (OHD)`}
                        >
                            {`${t('conditions')} (OHD)`}
                        </a>
                    </li>
                }
                {
                    <li>
                        <a
                            href={`${OHD_DOMAINS[railsMode]}/${locale}/privacy_protection`}
                            target="_blank"
                            rel="noreferrer"
                            title={t('privacy_protection')}
                        >
                            {t('privacy_protection')}
                        </a>
                    </li>
                }
                {['legal_info', 'contact'].map((key) => (
                    <li key={'external-link-' + key}>
                        <Link
                            to={`${pathBase}/${key}`}
                            title={t(key)}
                            className="u-ml-tiny"
                        >
                            {t(key)}
                        </Link>
                    </li>
                ))}
                {Object.keys(links).map((key) => (
                    <li key={'external-link-' + key}>
                        <a
                            className="Link"
                            href={links[key].url[locale]}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {links[key].name[locale]}
                        </a>
                    </li>
                ))}
            </ul>
            <p>{project?.name?.[locale]}</p>
            <p>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                    {`oh.d v${VERSION} `}
                    <FaGithub className="Icon" />
                </a>
            </p>

            <ProjectFooter project={project} locale={locale} />

            {sponsorLogos ? (
                <div className="home-content-logos">
                    {Object.keys(sponsorLogos).map((k) => {
                        let logo = sponsorLogos[k];
                        if (logo.locale === locale) {
                            return (
                                <a
                                    className="Link"
                                    href={logo.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={logo.title}
                                    key={`sponsor-logo-${k}`}
                                >
                                    <img src={logo.src} alt="" />
                                </a>
                            );
                        }
                    })}
                </div>
            ) : null}
        </footer>
    );
}

export default SiteFooter;
