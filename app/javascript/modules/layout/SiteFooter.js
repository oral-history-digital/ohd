import { useSelector } from 'react-redux';

import ProjectFooter from './ProjectFooter';
import { getCurrentProject } from 'modules/data';
import { getLocale } from 'modules/archive';

function SiteFooter() {
    const project = useSelector(getCurrentProject);
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
                            <a href={links[key].url[locale]}
                                target="_blank" rel="noopener">
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
                        {Object.keys(project.sponsor_logos).map((k, index) => {
                            let logo = project.sponsor_logos[k];
                            if (logo.locale === locale) {
                                return (
                                    <a href={logo.href} target='_blank' rel='noopener' title={logo.title} key={`sponsor-logo-${k}`}>
                                        <img src={ logo.src } />
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
