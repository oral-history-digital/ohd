import { useSelector } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import OHDLink from './OHDLink';
import ProjectLogo from './ProjectLogo';

function SiteHeader() {
    const project = useSelector(getCurrentProject);

    return (
        <header className="SiteHeader">
            <OHDLink />
            {project && (
                <ProjectLogo
                    logos={project.logos}
                    defaultLocale={project.default_locale}
                />
            )}

        </header>
    );
}

export default SiteHeader;
