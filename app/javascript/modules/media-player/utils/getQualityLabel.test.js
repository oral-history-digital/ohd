import { getQualityLabel } from './getQualityLabel';

describe('getQualityLabel', () => {
    test('returns label when available', () => {
        const source = { label: '1080p' };
        expect(getQualityLabel(source)).toBe('1080p');
    });

    test('generates label from height when label is missing', () => {
        const source = { height: 720 };
        expect(getQualityLabel(source)).toBe('720p');
    });

    test('returns 480p fallback when both label and height are missing', () => {
        const source = {};
        expect(getQualityLabel(source)).toBe('480p');
    });

    test('prefers label over height when both are available', () => {
        const source = { label: 'HD', height: 720 };
        expect(getQualityLabel(source)).toBe('HD');
    });

    test('returns 480p fallback when label is empty string', () => {
        const source = { label: '' };
        expect(getQualityLabel(source)).toBe('480p');
    });

    test('returns 480p fallback when label is null', () => {
        const source = { label: null };
        expect(getQualityLabel(source)).toBe('480p');
    });

    test('returns 480p fallback when height is 0', () => {
        const source = { height: 0 };
        expect(getQualityLabel(source)).toBe('480p');
    });
});
