import { normalizeLinks } from './normalizeLinks';

describe('normalizeLinks', () => {
    test('returns links unchanged when input is already an array', () => {
        const links = ['https://a.example', 'https://b.example'];

        expect(normalizeLinks(links)).toEqual(links);
    });

    test('splits string links by comma and newline', () => {
        const links =
            'https://a.example, https://b.example\nhttps://c.example\r\nhttps://d.example';

        expect(normalizeLinks(links)).toEqual([
            'https://a.example',
            'https://b.example',
            'https://c.example',
            'https://d.example',
        ]);
    });

    test('trims links and removes empty entries', () => {
        const links = '  https://a.example  ,\n,   \nhttps://b.example  ,  ';

        expect(normalizeLinks(links)).toEqual([
            'https://a.example',
            'https://b.example',
        ]);
    });

    test('returns empty array for unsupported input', () => {
        expect(normalizeLinks(null)).toEqual([]);
        expect(normalizeLinks(undefined)).toEqual([]);
        expect(normalizeLinks(42)).toEqual([]);
        expect(normalizeLinks({})).toEqual([]);
    });
});
