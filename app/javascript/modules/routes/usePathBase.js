import { useSelector } from 'react-redux';

import { getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import pathBase from './pathBase';

export function usePathBase() {
    const projects = useSelector(getProjects);
    const projectId = useSelector(getProjectId);
    const locale = useSelector(getLocale);

    return pathBase({ locale, projects, projectId });
}
