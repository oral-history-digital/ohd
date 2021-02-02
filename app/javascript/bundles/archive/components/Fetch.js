import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { fetchData } from '../actions/dataActionCreators';
import { getProjectId, getLocale } from '../selectors/archiveSelectors';
import Spinner from './Spinner';

export default function Fetch({
    fetchParams,
    testSelector,
    reloadSelector,
    fallback = <Spinner />,
    alwaysRenderChildren = false,
    children,
}) {
    const projectId = useSelector(getProjectId);
    const locale = useSelector(getLocale);
    const testResult = useSelector(testSelector);
    const doReload = useSelector(reloadSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!testResult) {
            dispatch(fetchData({ projectId, locale }, ...fetchParams));
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
