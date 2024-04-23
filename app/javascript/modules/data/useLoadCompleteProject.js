import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchData } from './actions';
import { getProjectsStatus } from './selectors/dataSelectors';
import { OHD_DOMAINS } from 'modules/constants';

const useLoadCompleteProject = (projectId) => {

    const projectsStatus = useSelector(getProjectsStatus);  
    const ohdDomain = OHD_DOMAINS[railsMode];
    const ohd = {shortname: 'ohd', archive_domain: ohdDomain};

    useEffect(() => {
        if (!projectsStatus[projectId]) {
            fetchData({ locale: 'de', project: ohd}, 'projects', projectId);
        }
    }, [projectId]);

}

export default useLoadCompleteProject;
