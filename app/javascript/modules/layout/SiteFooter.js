import { useSelector } from 'react-redux';

import { getLocale } from 'modules/archive';
import { useProject } from 'modules/routes';
import ProjectFooter from './ProjectFooter';

function SiteFooter() {
    const { project } = useProject();
    const locale = useSelector(getLocale);

    let links = {};
    if (project) {
        links = project.external_links;
    }

    return (
        <footer>
            <ul className='footer-bottom-nav'>
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
