import unescapeHtmlEntities from './unescapeHtmlEntities';

describe('unescapeHtmlEntities', () => {
    test('returns undefined for undefined input', () => {
        expect(unescapeHtmlEntities(undefined)).toBeUndefined();
    });

    test('returns null for null input', () => {
        expect(unescapeHtmlEntities(null)).toBeNull();
    });

    test('replaces &quot; with double quotes', () => {
        expect(unescapeHtmlEntities('He said &quot;hello&quot;')).toBe(
            'He said "hello"'
        );
    });

    test('replaces &apos; with backtick (preserve existing behavior)', () => {
        expect(unescapeHtmlEntities('It&apos;s ok')).toBe('It`s ok');
    });

    test('replaces multiple occurrences', () => {
        const input = '&quot;a&quot; &quot;b&quot; &apos;c&apos;';
        expect(unescapeHtmlEntities(input)).toBe('"a" "b" `c`');
    });

    test('returns original string when no entities present', () => {
        const s = 'plain text';
        expect(unescapeHtmlEntities(s)).toBe(s);
    });
});
