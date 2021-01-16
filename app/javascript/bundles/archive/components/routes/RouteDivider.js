import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setLocale, setProjectId } from '../../actions/archiveActionCreators';

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

export default LocaleRoute;
