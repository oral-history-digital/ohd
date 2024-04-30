import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchData } from './actions';
import { getProjectsStatus, getPublicProjects } from './selectors/dataSelectors';
import { OHD_DOMAINS } from 'modules/constants';

const useLoadCompleteProject = (pId) => {

    const projects = useSelector(getPublicProjects);
    const projectsStatus = useSelector(getProjectsStatus);  
    const ohdDomain = OHD_DOMAINS[railsMode];
    const ohd = {shortname: 'ohd', archive_domain: ohdDomain};
    const project = projects.find(p => p.id === pId);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!projectsStatus[pId]) {
            dispatch(fetchData({ locale: 'de', project: ohd}, 'projects', pId));
        }
    }, [project]);

    return project;
}

export default useLoadCompleteProject;
