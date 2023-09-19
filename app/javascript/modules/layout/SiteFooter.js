import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useProject, usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import ProjectFooter from './ProjectFooter';

function SiteFooter() {
    const { project } = useProject();
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
                    ['conditions', 'privacy_protection', 'legal_info', 'contact'].map(key => (
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
                    !project.is_ohd && <li key={'external-link-ohd_conditions'}>
                        <Link
                            to={`${pathBase}/ohd_conditions`}
                            title={t('ohd_conditions')}
                            className="u-ml-tiny"
                        >
                            {t('ohd_conditions')}
                        </Link>
                    </li>
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
