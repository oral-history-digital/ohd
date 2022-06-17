import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { WrappedProjectsContainer } from 'modules/admin';

export default function ProjectIndex() {
    const dispatch = useDispatch();

    return (
        <div className="wrapper-content project-index">
            <WrappedProjectsContainer />
        </div>
    );
}
