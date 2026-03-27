export function escapeRegExp(query) {
    return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightQueryInHtml(html, query) {
    if (!query || !html || typeof DOMParser === 'undefined') {
        return html || '';
    }

    const escaped = escapeRegExp(query);
    const matcher = new RegExp(`(${escaped})`, 'gi');

    // Parse into a detached document so we can safely transform text nodes only.
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const root = doc.body.firstChild;
    // 4 === NodeFilter.SHOW_TEXT; this avoids touching markup/attributes.
    const walker = doc.createTreeWalker(root, 4);
    const textNodes = [];

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach((textNode) => {
        if (!matcher.test(textNode.nodeValue || '')) {
            matcher.lastIndex = 0;
            return;
        }

        matcher.lastIndex = 0;
        const parts = (textNode.nodeValue || '').split(matcher);
        // Build a replacement fragment with <mark> wrappers for matches.
        const fragment = doc.createDocumentFragment();

        parts.forEach((part) => {
            if (!part) return;

            if (part.toLowerCase() === query.toLowerCase()) {
                const mark = doc.createElement('mark');
                mark.className = 'Highlight';
                mark.textContent = part;
                fragment.appendChild(mark);
                return;
            }

            fragment.appendChild(doc.createTextNode(part));
        });

        textNode.parentNode.replaceChild(fragment, textNode);
    });

    // Return the transformed HTML for a sanitized dangerouslySetInnerHTML render.
    return root.innerHTML;
}
