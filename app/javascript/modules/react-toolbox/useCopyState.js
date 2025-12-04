import { useEffect, useState } from 'react';

const DURATION = 1000;

export default function useCopyState() {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, DURATION);
        }
    }, [copied]);

    function setToCopied() {
        setCopied(true);
    }

    return {
        copied,
        setToCopied,
    };
}
