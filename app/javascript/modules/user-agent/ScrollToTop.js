import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function ScrollToTop({ children }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return children;
}

ScrollToTop.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
