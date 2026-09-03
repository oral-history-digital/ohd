import {
    ProjectsAdminList,
    useHydrateProjectsForAdmin,
} from '../features/projects';

export default function ProjectsAdminPage() {
    useHydrateProjectsForAdmin();

    return (
        <div className="wrapper-content project-index">
            <ProjectsAdminList />
        </div>
    );
}
