import { useProject } from 'modules/routes';
import OHDLink from './OHDLink';
import ProjectLogo from './ProjectLogo';

function SiteHeader() {
    const { project } = useProject();

    return (
        <header className="SiteHeader">
            <OHDLink className="SiteHeader-link SiteHeader-link--site" />

            {project && (
                <ProjectLogo
                    className="SiteHeader-link SiteHeader-link--collection"
                    logos={project.logos}
                    defaultLocale={project.default_locale}
                />
            )}
        </header>
    );
}

export default SiteHeader;
