import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { WrappedProjectsContainer } from 'modules/admin';
import { setFlyoutTabsIndex, INDEX_NONE } from 'modules/flyout-tabs';

export default function ProjectIndex() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setFlyoutTabsIndex(INDEX_NONE));
    }, []);

    return (
        <div className="wrapper-content project-index">
            <WrappedProjectsContainer />
        </div>
    );
}
