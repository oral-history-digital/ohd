import { useSelector } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import OHDLink from './OHDLink';
import ProjectLogo from './ProjectLogo';

function SiteHeader() {
    const project = useSelector(getCurrentProject);

    return (
        <header className="SiteHeader">
            <OHDLink className="SiteHeader-link" />

            {project && (
                <ProjectLogo
                    className="SiteHeader-link"
                    logos={project.logos}
                    defaultLocale={project.default_locale}
                />
            )}
        </header>
    );
}

export default SiteHeader;
