import { escapeRegExp, highlightQueryInHtml } from './highlightQueryInHtml';

describe('highlightQueryInHtml', () => {
    describe('escapeRegExp', () => {
        it('escapes regex special characters', () => {
            expect(escapeRegExp('a+b*c?.^$[]()|\\')).toBe(
                'a\\+b\\*c\\?\\.\\^\\$\\[\\]\\(\\)\\|\\\\'
            );
        });
    });

    it('returns original html when query is empty', () => {
        expect(highlightQueryInHtml('<p>Hello world</p>', '')).toBe(
            '<p>Hello world</p>'
        );
    });

    it('returns empty string when html is empty', () => {
        expect(highlightQueryInHtml('', 'hello')).toBe('');
    });

    it('highlights matching text case-insensitively', () => {
        const html = '<p>Hello <strong>HELLO</strong> world</p>';
        const result = highlightQueryInHtml(html, 'hello');

        expect(result).toBe(
            '<p><mark class="Highlight">Hello</mark> <strong><mark class="Highlight">HELLO</mark></strong> world</p>'
        );
    });

    it('does not modify html attributes, only text nodes', () => {
        const html = '<a href="/hello">hello</a>';
        const result = highlightQueryInHtml(html, 'hello');

        expect(result).toContain('href="/hello"');
        expect(result).toContain('<mark class="Highlight">hello</mark>');
    });

    it('supports queries containing regex characters', () => {
        const html = '<p>a+b and a+b</p>';
        const result = highlightQueryInHtml(html, 'a+b');

        expect(result).toBe(
            '<p><mark class="Highlight">a+b</mark> and <mark class="Highlight">a+b</mark></p>'
        );
    });

    it('falls back to original html when DOMParser is unavailable', () => {
        const original = globalThis.DOMParser;
        globalThis.DOMParser = undefined;

        const html = '<p>Hello world</p>';
        const result = highlightQueryInHtml(html, 'hello');

        expect(result).toBe(html);

        globalThis.DOMParser = original;
    });
});
