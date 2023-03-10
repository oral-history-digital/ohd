import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { fetchData } from 'modules/data';
import { getProjectId, getLocale } from 'modules/archive';
import { getCurrentProject, getStatuses } from 'modules/data';
import { Spinner } from 'modules/spinners';

export default function Fetch({
    fetchParams,
    testSelector,
    reloadSelector,
    fallback = <Spinner />,
    alwaysRenderChildren = false,
    children,
    testDataType,
    testIdOrDesc,
}) {
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);
    const locale = useSelector(getLocale);
    const statuses = useSelector(getStatuses);
    const testResult = (typeof testSelector === 'function') ?
        useSelector(testSelector) :
        !!(statuses[testDataType] && statuses[testDataType][testIdOrDesc]);
    const doReload = reloadSelector && useSelector(reloadSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!testResult) {
            dispatch(fetchData({ projectId, locale, project }, ...fetchParams));
        }
    }, [JSON.stringify(fetchParams), doReload]);

    if (testResult || alwaysRenderChildren) {
        return children;
    }

    return fallback;
}

Fetch.propTypes = {
    fetchParams: PropTypes.array.isRequired,
    testSelector: PropTypes.func,
    testDataType: PropTypes.string,
    testIdOrDesc: PropTypes.oneOfType([
        PropTypes.integer,
        PropTypes.string,
    ]),
    fallback: PropTypes.element,
    alwaysRenderChildren: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
