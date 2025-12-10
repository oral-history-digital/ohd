import { useEffect } from 'react';

import { getLocale } from 'modules/archive';
import { fetchData, getStatuses } from 'modules/data';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

export function Fetch({
    fetchParams,
    testSelector,
    reloadSelector,
    fallback = <Spinner />,
    alwaysRenderChildren = false,
    children,
    testDataType,
    testIdOrDesc,
}) {
    const dispatch = useDispatch();
    const { project, projectId } = useProject();

    const locale = useSelector(getLocale);
    const statuses = useSelector(getStatuses);
    const selectorResult = useSelector(testSelector || (() => null));
    const doReload = useSelector(reloadSelector || (() => false));

    const testResult =
        typeof testSelector === 'function'
            ? selectorResult
            : !!(
                  statuses[testDataType] &&
                  /^fetched/.test(statuses[testDataType][testIdOrDesc])
              );

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
    reloadSelector: PropTypes.func,
    testDataType: PropTypes.string,
    testIdOrDesc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fallback: PropTypes.element,
    alwaysRenderChildren: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

export default Fetch;
