import { getNextInterview, getPreviousInterview } from './getInterviews';

describe('getNextInterview', () => {
    test('gets next archive id based on given archive ids', () => {
        const archiveIds = ['cd001', 'cd002', 'cd005', 'cd007', 'cd009'];

        const actual = getNextInterview(archiveIds, 'cd005');
        const expected = 'cd007';
        expect(actual).toEqual(expected);
    });

    test('return undefined if already at the end', () => {
        const archiveIds = ['cd001', 'cd002', 'cd005', 'cd007', 'cd009'];

        const actual = getNextInterview(archiveIds, 'cd009');
        const expected = undefined;
        expect(actual).toEqual(expected);
    });

    test('throws when current archive id is not in archive ids', () => {
        const archiveIds = ['cd001', 'cd002', 'cd005', 'cd007', 'cd009'];

        expect(() => {
            getNextInterview(archiveIds, 'cd006');
        }).toThrow(ReferenceError);
    });
});

describe('getPreviousInterview', () => {
    test('gets previous archive id based on given archive ids', () => {
        const archiveIds = ['cd001', 'cd002', 'cd005', 'cd007', 'cd009'];

        const actual = getPreviousInterview(archiveIds, 'cd005');
        const expected = 'cd002';
        expect(actual).toEqual(expected);
    });

    test('return undefined if already at the beginning', () => {
        const archiveIds = ['cd001', 'cd002', 'cd005', 'cd007', 'cd009'];

        const actual = getPreviousInterview(archiveIds, 'cd001');
        const expected = undefined;
        expect(actual).toEqual(expected);
    });

    test('throws when current archive id is not in archive ids', () => {
        const archiveIds = ['cd001', 'cd002', 'cd005', 'cd007', 'cd009'];

        expect(() => {
            getPreviousInterview(archiveIds, 'cd006');
        }).toThrow(ReferenceError);
    });
});
