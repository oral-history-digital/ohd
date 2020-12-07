import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Spinner from './Spinner';

export default function StateCheck({
    testSelector,
    fallback = <Spinner />,
    children,
}) {
    const testResult = useSelector(testSelector);

    if (!testResult) {
        return fallback;
    }

    return children;
}

StateCheck.propTypes = {
    testSelector: PropTypes.func.isRequired,
    fallback: PropTypes.element,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
