import { useSelector } from 'react-redux';

import { getCurrentProject } from 'modules/data';

export default function useProject() {
    const currentProject = useSelector(getCurrentProject);

    return {
        project: currentProject,
        projectId: currentProject?.shortname,
        isOhd: currentProject?.is_ohd,
    };
}
