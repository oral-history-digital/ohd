import { ProjectsAdminList, useHydrateProjectsForAdmin } from '.';

export default function ProjectsAdminPage() {
    useHydrateProjectsForAdmin();

    return (
        <div className="wrapper-content project-index">
            <ProjectsAdminList />
        </div>
    );
}
