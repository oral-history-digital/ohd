import { useState } from 'react';

export function useAccordion() {
    const [expandedId, setExpandedId] = useState(null);
    const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));
    return { expandedId, toggle };
}
