import { useSelector } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import pathBase from './pathBase';

export function usePathBase() {
    const project = useSelector(getCurrentProject);
    const projectId = useSelector(getProjectId);
    const locale = useSelector(getLocale);

    return pathBase({ locale, project, projectId });
}
