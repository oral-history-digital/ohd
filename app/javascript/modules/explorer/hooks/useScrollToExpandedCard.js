import { useEffect, useRef } from 'react';

import { scrollSmoothlyTo } from 'modules/user-agent';

export function useScrollToExpandedCard(expanded, scrollOffset = 16) {
    const cardRef = useRef(null);
    const wasExpandedRef = useRef(expanded);

    useEffect(() => {
        const wasExpanded = wasExpandedRef.current;
        wasExpandedRef.current = expanded;

        if (!expanded || wasExpanded || !cardRef.current) {
            return;
        }

        const cardTop =
            cardRef.current.getBoundingClientRect().top + window.scrollY;
        scrollSmoothlyTo(0, Math.max(cardTop - scrollOffset, 0));
    }, [expanded, scrollOffset]);

    return cardRef;
}
