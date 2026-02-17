import { useProjectTranslation } from 'modules/i18n';

import { useGetMediaMissingText } from './useGetMediaMissingText';

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(() => ({
        t: jest.fn(() => 'Default missing media text'),
    })),
    useProjectTranslation: jest.fn(),
}));

jest.mock('modules/routes', () => ({
    useProject: jest.fn(() => ({ project: {} })),
}));

describe('useGetMediaMissingText', () => {
    it('returns custom media missing text when available', () => {
        useProjectTranslation.mockReturnValue({
            media_missing_text: 'Custom no media message',
        });

        const result = useGetMediaMissingText();

        expect(result).toBe('Custom no media message');
    });

    it('returns default translation when custom text is missing', () => {
        useProjectTranslation.mockReturnValue({});

        const result = useGetMediaMissingText();

        expect(result).toBe('Default missing media text');
    });

    it('returns default translation when custom text is empty', () => {
        useProjectTranslation.mockReturnValue({
            media_missing_text: '   ',
        });

        const result = useGetMediaMissingText();

        expect(result).toBe('Default missing media text');
    });

    it('returns default translation when custom text is not a string', () => {
        useProjectTranslation.mockReturnValue({
            media_missing_text: 123,
        });

        const result = useGetMediaMissingText();

        expect(result).toBe('Default missing media text');
    });
});
