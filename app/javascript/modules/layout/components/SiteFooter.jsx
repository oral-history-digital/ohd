/* global railsMode */
/* global VERSION */
import { GITHUB_URL, OHD_DOMAINS } from 'modules/constants';
import { getUmbrellaProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { FaGithub } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import ProjectFooter from './ProjectFooter';

/**
 * Shows global navigation while project footer content loads from Redux.
 *
 * @returns {React.ReactElement|null} Footer once the current project's shortname is available.
 */
export function SiteFooter() {
    const { project, projectShortname } = useProject({ include: ['footer'] });
    const umbrellaProject = useSelector(getUmbrellaProject);
    const pathBase = usePathBase();
    const { t, locale } = useI18n();

    if (!projectShortname) return null;

    const links = project?.external_links || [];
    const sponsorLogos = project?.sponsor_logos || [];
    const umbrellaShortname =
        umbrellaProject?.display_shortname || umbrellaProject?.shortname;
    const umbrellaConditionsLabel = umbrellaShortname
        ? `${t('conditions')} (${umbrellaShortname})`
        : t('conditions');

    return (
        <footer>
            <ul className="footer-bottom-nav">
                {project &&
                    !project.grant_project_access_instantly &&
                    !project.grant_access_without_login &&
                    !project.is_umbrella && (
                        <li>
                            <Link
                                to={`${pathBase}/conditions`}
                                title={`${t('conditions')} (${project.shortname})`}
                            >
                                {`${t('conditions')} (${project.shortname})`}
                            </Link>
                        </li>
                    )}
                {
                    <li>
                        <a
                            href={`${OHD_DOMAINS[railsMode]}/${locale}/conditions`}
                            target="_blank"
                            rel="noreferrer"
                            title={umbrellaConditionsLabel}
                        >
                            {umbrellaConditionsLabel}
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
                {links.map((link) => (
                    <li key={'external-link-' + link.id}>
                        <a
                            className="Link"
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {link.name}
                        </a>
                    </li>
                ))}
            </ul>
            <p>{project?.name}</p>
            <p>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                    {`oh.d v${VERSION} `}
                    <FaGithub className="Icon" />
                </a>
            </p>

            <ProjectFooter project={project} locale={locale} />

            <div className="home-content-logos">
                {sponsorLogos.map((logo) => (
                    <a
                        className="Link"
                        href={logo.href}
                        target="_blank"
                        rel="noreferrer"
                        title={logo.title}
                        key={`sponsor-logo-${logo.id}`}
                    >
                        <img src={logo.url} alt="" />
                    </a>
                ))}
            </div>
        </footer>
    );
}

export default SiteFooter;
