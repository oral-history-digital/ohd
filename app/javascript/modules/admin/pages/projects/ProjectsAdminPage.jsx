import { ProjectsAdminList } from '.';

/**
 * Displays project administration within the page layout.
 *
 * @returns {React.ReactElement} Project administration page.
 */
export default function ProjectsAdminPage() {
    return (
        <div className="wrapper-content project-index">
            <ProjectsAdminList />
        </div>
    );
}
