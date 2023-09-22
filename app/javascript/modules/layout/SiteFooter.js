import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useProject, usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import ProjectFooter from './ProjectFooter';
import { OHD_DOMAINS } from 'modules/constants';

function SiteFooter() {
    const { project, projectId } = useProject();
    const pathBase = usePathBase();
    const { t, locale } = useI18n();

    let links = {};
    if (project) {
        links = project.external_links;
    }

    return (
        <footer>
            <ul className='footer-bottom-nav'>
                {
                    !project.grant_project_access_instantly &&
                    !project.grant_access_without_login &&
                    <li key={'external-link-conditions'}>
                        <Link
                            to={`${pathBase}/conditions`}
                            title={`${t('conditions')} (${projectId})`}
                            className="u-ml-tiny"
                        >
                            {`${t('conditions')} (${projectId})`}
                        </Link>
                    </li>
                }
                {
                    <li key={'external-link-ohd_conditions'}>
                        <a
                            href={`${OHD_DOMAINS[railsMode]}/${locale}/conditions`}
                            target="_blank"
                            title={`${t('conditions')} (OHD)`}
                            className="u-ml-tiny"
                        >
                            {`${t('conditions')} (OHD)`}
                        </a>
                    </li>
                }
                {
                    <li key={'external-link-privacy_protection'}>
                        <a
                            href={`${OHD_DOMAINS[railsMode]}/${locale}/privacy_protection`}
                            target="_blank"
                            title={t('privacy_protection')}
                            className="u-ml-tiny"
                        >
                            {t('privacy_protection')}
                        </a>
                    </li>
                }
                {
                    ['legal_info', 'contact'].map(key => (
                        <li key={'external-link-' + key}>
                            <Link
                                to={`${pathBase}/${key}`}
                                title={t(key)}
                                className="u-ml-tiny"
                            >
                                {t(key)}
                            </Link>
                        </li>
                    ))
                }
                {
                    Object.keys(links).map(key => (
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
                    ))
                }
            </ul>
            <p>{project && project.name[locale]}</p>

            <ProjectFooter project={project} locale={locale}/>

            {
                project?.sponsor_logos ?
                (
                    <div className='home-content-logos'>
                        {Object.keys(project.sponsor_logos).map(k => {
                            let logo = project.sponsor_logos[k];
                            if (logo.locale === locale) {
                                return (
                                    <a
                                        className="Link"
                                        href={logo.href}
                                        target='_blank'
                                        rel='noreferrer'
                                        title={logo.title}
                                        key={`sponsor-logo-${k}`}
                                    >
                                        <img src={ logo.src } alt="" />
                                    </a>
                                );
                            }
                        })}
                    </div>
                ) : null
            }
        </footer>
    );
}

export default SiteFooter;
