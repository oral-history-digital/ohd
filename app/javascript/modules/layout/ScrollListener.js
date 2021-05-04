import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function ScrollListener({ children }) {
    const [isSticky, setIsSticky] = useState(false);
    const mediaPlayerEl = useRef(null);

    useEffect(() => {
        const listener = (e) => {
            const scrollY = e.target.scrollingElement.scrollTop;

            if (scrollY > 400) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', listener);

        const removeListener = () => window.removeEventListener('scroll', listener);

        return removeListener;
    });

    return children(isSticky, mediaPlayerEl);
}

ScrollListener.propTypes = {
    children: PropTypes.func.isRequired,
}
