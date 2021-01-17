import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setProjectId } from '../../actions/archiveActionCreators';
import { getProjects } from '../../selectors/dataSelectors';

import ProjectLocaleRoute from './ProjectLocaleRoute';
import LocaleRoute from './LocaleRoute';

import { projectByDomain } from 'lib/utils';

function RouteDivider() {
    const projects = useSelector(getProjects);
    const projectFromDomain = projectByDomain(projects);
    const dispatch = useDispatch();

    useEffect(() => {
        if (projectFromDomain) {
            dispatch(setProjectId(projectFromDomain.short_name));
        }
    }, [window.location.host]);

    return (
        <>
            { !projectFromDomain && <Route component={ProjectLocaleRoute} /> }
            { projectFromDomain && <Route component={LocaleRoute} /> }
        </>
    );
}

export default RouteDivider;
