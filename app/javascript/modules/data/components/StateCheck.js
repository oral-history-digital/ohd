import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

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
