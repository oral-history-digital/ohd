import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { fetchData } from 'modules/data';
import { getProjectId, getLocale } from 'modules/archive';
import { getProjects } from 'modules/data';
import { Spinner } from 'modules/spinners';

export default function Fetch({
    fetchParams,
    testSelector,
    reloadSelector,
    fallback = <Spinner />,
    alwaysRenderChildren = false,
    children,
}) {
    const projectId = useSelector(getProjectId);
    const projects = useSelector(getProjects);
    const locale = useSelector(getLocale);
    const testResult = useSelector(testSelector);
    const doReload = reloadSelector && useSelector(reloadSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!testResult) {
            dispatch(fetchData({ projectId, locale, projects }, ...fetchParams));
        }
    }, [JSON.stringify(fetchParams), doReload]);

    if (testResult || alwaysRenderChildren) {
        return children;
    }

    return fallback;
}

Fetch.propTypes = {
    fetchParams: PropTypes.array.isRequired,
    testSelector: PropTypes.func.isRequired,
    fallback: PropTypes.element,
    alwaysRenderChildren: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};