import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { WrappedProjectsContainer } from 'modules/admin';
import { setSidebarTabsIndex, INDEX_NONE } from 'modules/sidebar';

export default function ProjectIndex() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSidebarTabsIndex(INDEX_NONE));
    }, []);

    return (
        <div className="wrapper-content project-index">
            <WrappedProjectsContainer />
        </div>
    );
}
