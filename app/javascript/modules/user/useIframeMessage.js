import { useEffect, useRef } from 'react';

export function useIframeMessage(callback) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleMessage = (event) => {
            callbackRef.current(event.data, event);
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    });
}
