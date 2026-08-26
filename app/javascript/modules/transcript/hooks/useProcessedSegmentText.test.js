import { renderHook } from '@testing-library/react';

import { useProcessedSegmentText } from './useProcessedSegmentText';

// Mock utilities
jest.mock('../utils', () => ({
    checkTextDir: jest.fn((text) => {
        if (!text) return 'ltr';
        // Simple mock: if text contains specific marker, return rtl
        return text.includes('RTL_MARKER') ? 'rtl' : 'ltr';
    }),
    enforceRtlOnTranscriptTokens: jest.fn((text) => `[RTL]${text}[/RTL]`),
}));

describe('useProcessedSegmentText', () => {
    let result;
    let rerender;
    let enforceRtlMock;

    beforeAll(() => {
        const mockModule = jest.requireMock('../utils');
        enforceRtlMock = mockModule.enforceRtlOnTranscriptTokens;
    });

    const render = (props) => {
        const renderedHook = renderHook(
            (hookProps) => useProcessedSegmentText(hookProps),
            { initialProps: props }
        );
        result = renderedHook.result;
        rerender = renderedHook.rerender;
    };

    afterEach(() => {
        result = null;
        rerender = null;
        jest.clearAllMocks();
    });

    it('returns full text when canEditSegment is true', () => {
        const segment = {
            text: {
                en: 'Full text',
                'en-public': 'Public text',
            },
        };

        render({
            segment,
            contentLocale: 'en',
            canEditSegment: true,
        });

        expect(result.current.text).toBe('Full text');
    });

    it('returns public text when canEditSegment is false', () => {
        const segment = {
            text: {
                en: 'Full text',
                'en-public': 'Public text',
            },
        };

        render({
            segment,
            contentLocale: 'en',
            canEditSegment: false,
        });

        expect(result.current.text).toBe('Public text');
    });

    it('falls back to public variant when full text not available', () => {
        const segment = {
            text: {
                'en-public': 'Public text only',
            },
        };

        render({
            segment,
            contentLocale: 'en',
            canEditSegment: true,
        });

        expect(result.current.text).toBe('Public text only');
    });

    it('returns ltr text direction for LTR text', () => {
        const segment = {
            text: {
                en: 'Hello world',
            },
        };

        render({
            segment,
            contentLocale: 'en',
            canEditSegment: true,
        });

        expect(result.current.textDir).toBe('ltr');
    });

    it('returns rtl text direction for RTL text', () => {
        const segment = {
            text: {
                ar: 'RTL_MARKER السلام',
            },
        };

        render({
            segment,
            contentLocale: 'ar',
            canEditSegment: true,
        });

        expect(result.current.textDir).toBe('rtl');
    });

    it('applies RTL wrapping when textDir is rtl', () => {
        const segment = {
            text: {
                ar: 'RTL_MARKER النص',
            },
        };

        render({
            segment,
            contentLocale: 'ar',
            canEditSegment: true,
        });

        expect(enforceRtlMock).toHaveBeenCalledWith('RTL_MARKER النص');
        expect(result.current.text).toBe('[RTL]RTL_MARKER النص[/RTL]');
    });

    it('does not apply RTL wrapping for LTR text', () => {
        enforceRtlMock.mockClear();

        const segment = {
            text: {
                en: 'Hello world',
            },
        };

        render({
            segment,
            contentLocale: 'en',
            canEditSegment: true,
        });

        expect(enforceRtlMock).not.toHaveBeenCalled();
        expect(result.current.text).toBe('Hello world');
    });

    it('handles undefined text gracefully', () => {
        const segment = {
            text: {},
        };

        render({
            segment,
            contentLocale: 'en',
            canEditSegment: true,
        });

        expect(result.current.text).toBeUndefined();
        expect(result.current.textDir).toBe('ltr');
    });

    it('memoizes result based on segment, contentLocale, and canEditSegment', () => {
        const segment = {
            text: {
                en: 'Hello',
            },
        };

        const props = {
            segment,
            contentLocale: 'en',
            canEditSegment: true,
        };

        render(props);
        const result1 = result.current;

        // Re-render with same props
        rerender(props);
        const result2 = result.current;

        expect(result1).toBe(result2);
    });

    it('updates when contentLocale changes', () => {
        const segment = {
            text: {
                en: 'English',
                es: 'Español',
            },
        };

        const props = {
            segment,
            contentLocale: 'en',
            canEditSegment: true,
        };
        render(props);

        expect(result.current.text).toBe('English');

        rerender({ ...props, contentLocale: 'es' });
        expect(result.current.text).toBe('Español');
    });
});
