import { useEffect } from 'react';

import { fetchData, getStatuses } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Loads a Redux resource through the current project/locale route.
 *
 * @param {Object} props - Resource request and readiness checks.
 * @param {Array} props.fetchParams - Data type, optional ID, nested type, and query string.
 * @param {Function} [props.testSelector] - Selects whether the resource is ready.
 * @param {Function} [props.reloadSelector] - Triggers another readiness check when changed.
 * @param {React.ReactElement} [props.fallback] - Shown while waiting for data.
 * @param {boolean} [props.alwaysRenderChildren=false] - Shows children before data is ready.
 * @param {React.ReactNode} [props.children] - Resource consumers.
 * @param {string} [props.testDataType] - Status category when no test selector is supplied.
 * @param {string|number} [props.testIdOrDesc] - Status key in that category.
 * @returns {React.ReactNode} Children or loading fallback.
 */
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
    const pathBase = usePathBase();
    const [dataType, id, nestedDataType, extraParams] = fetchParams;

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
            dispatch(
                fetchData(
                    { pathBase },
                    dataType,
                    id,
                    nestedDataType,
                    extraParams
                )
            );
        }
    }, [
        dispatch,
        pathBase,
        dataType,
        id,
        nestedDataType,
        extraParams,
        testResult,
        doReload,
    ]);

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
