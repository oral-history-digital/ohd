import { useSelector } from 'react-redux';

import { projectByDomain } from 'lib/utils';
import { getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';

export function usePathBase() {
    const projects = useSelector(getProjects);
    const projectId = useSelector(getProjectId);
    const locale = useSelector(getLocale);

    if (projectByDomain(projects)) {
        return `/${locale}`;
    } else {
        return `/${projectId}/${locale}`;
    }
}
