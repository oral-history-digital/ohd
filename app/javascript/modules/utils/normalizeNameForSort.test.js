import normalizeNameForSort from './normalizeNameForSort';

describe('normalizeNameForSort', () => {
    test('strips leading ascii punctuation and whitespace', () => {
        expect(normalizeNameForSort('  "(Alpha')).toBe('alpha');
    });

    test('strips leading typographic german and english quotes', () => {
        expect(normalizeNameForSort('„Name“')).toBe('name“');
        expect(normalizeNameForSort('“Upper quote”')).toBe('upper quote”');
    });

    test('keeps a plain name and lowercases it', () => {
        expect(normalizeNameForSort('Archiv')).toBe('archiv');
    });
});
