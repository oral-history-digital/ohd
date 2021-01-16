import { useSelector } from 'react-redux';
import { projectByDomain } from 'lib/utils';
import { getProjects } from '../selectors/dataSelectors';
import { getLocale, getProjectId } from '../selectors/archiveSelectors';

export function usePathBase() {
    const projects = useSelector(getProjects);
    const projectId = useSelector(getProjectId);
    const projects = useSelector(getLocale);

    if (projectByDomain(projects)) {
        return `/${locale}`;
    } else {
        return `/${projectId}/${locale}`;
    }
}


