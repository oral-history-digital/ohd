import React from 'react';
import { TextEncoder, TextDecoder } from 'util';
React.useLayoutEffect = React.useEffect;

window.matchMedia =
    window.matchMedia ||
    function () {
        return {
            matches: false,
            addListener: function () {},
            removeListener: function () {},
        };
    };

// Node (jsdom) in some environments doesn't provide TextEncoder/TextDecoder
if (typeof globalThis.TextEncoder === 'undefined') {
    globalThis.TextEncoder = TextEncoder;
    globalThis.TextDecoder = TextDecoder;
}
