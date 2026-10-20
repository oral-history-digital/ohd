import { useProject } from 'modules/routes';

import { useGetMediaMissingText } from './useGetMediaMissingText';

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(() => ({
        t: jest.fn(() => 'Default missing media text'),
    })),
}));

jest.mock('modules/routes', () => ({
    useProject: jest.fn(() => ({ project: {} })),
}));

describe('useGetMediaMissingText', () => {
    it('returns custom media missing text when available', () => {
        useProject.mockReturnValue({
            project: {
                media_missing_text: 'Custom no media message',
            },
        });

        const result = useGetMediaMissingText();

        expect(result).toBe('Custom no media message');
    });

    it('returns default translation when custom text is missing', () => {
        useProject.mockReturnValue({ project: {} });

        const result = useGetMediaMissingText();

        expect(result).toBe('Default missing media text');
    });

    it('returns default translation when custom text is empty', () => {
        useProject.mockReturnValue({
            project: {
                media_missing_text: '   ',
            },
        });

        const result = useGetMediaMissingText();

        expect(result).toBe('Default missing media text');
    });

    it('returns default translation when custom text is not a string', () => {
        useProject.mockReturnValue({
            project: {
                media_missing_text: 123,
            },
        });

        const result = useGetMediaMissingText();

        expect(result).toBe('Default missing media text');
    });
});

test.each([{ isLoading: true }, { error: { message: 'Access denied' } }])(
    'uses the default while playback settings are unavailable: %p',
    (status) => {
        useProject.mockReturnValue({
            project: { media_missing_text: 'Retained message' },
            ...status,
        });
        expect(useGetMediaMissingText()).toBe('Default missing media text');
        expect(useProject).toHaveBeenCalledWith({ include: ['playback'] });
    }
);
