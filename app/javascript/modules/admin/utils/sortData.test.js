import { sortData } from './sortData';

describe('admin data sorting', () => {
    test('sorts values by a plain attribute', () => {
        const data = [
            { id: 1, name: 'Charlie' },
            { id: 2, name: 'Alice' },
            { id: 3, name: 'Bob' },
        ];
        const sortedData = sortData(data, 'name');
        expect(sortedData).toEqual([
            { id: 2, name: 'Alice' },
            { id: 3, name: 'Bob' },
            { id: 1, name: 'Charlie' },
        ]);
    });

    test('sorts values by a translated attribute in the selected locale', () => {
        const data = [
            { id: 1, name: { de: 'Zebra', en: 'Apple' } },
            { id: 2, name: { de: 'Apfel', en: 'Zebra' } },
        ];

        expect(sortData(data, 'name', true, 'de')).toEqual([
            { id: 2, name: { de: 'Apfel', en: 'Zebra' } },
            { id: 1, name: { de: 'Zebra', en: 'Apple' } },
        ]);
    });

    test('preserves order when a value lacks the sort attribute', () => {
        const data = [
            { id: 1, name: 'Charlie' },
            { id: 2 },
            { id: 3, name: 'Alice' },
        ];

        expect(sortData(data, 'name')).toEqual(data);
    });

    test('returns object values without sorting when no attribute is given', () => {
        const first = { id: 1 };
        const second = { id: 2 };

        expect(sortData({ first, second })).toEqual([first, second]);
    });

    test('filters falsy values', () => {
        expect(sortData([{ id: 1 }, null, false, undefined])).toEqual([
            { id: 1 },
        ]);
    });

    test('returns an empty array without data', () => {
        expect(sortData()).toEqual([]);
    });

    test('does not mutate the input array', () => {
        const data = [{ name: 'Beta' }, { name: 'Alpha' }];

        sortData(data, 'name');

        expect(data).toEqual([{ name: 'Beta' }, { name: 'Alpha' }]);
    });
});
