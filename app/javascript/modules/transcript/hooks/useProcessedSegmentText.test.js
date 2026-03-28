import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';

import { useProcessedSegmentText } from './useProcessedSegmentText';

Enzyme.configure({ adapter: new Adapter() });

// Mock utilities
jest.mock('../utils', () => ({
    checkTextDir: jest.fn((text) => {
        if (!text) return 'ltr';
        // Simple mock: if text contains specific marker, return rtl
        return text.includes('RTL_MARKER') ? 'rtl' : 'ltr';
    }),
    enforceRtlOnTranscriptTokens: jest.fn((text) => `[RTL]${text}[/RTL]`),
}));

function TestComponent({ onRender, ...props }) {
    const result = useProcessedSegmentText(props);

    React.useEffect(() => {
        onRender(result);
    }, [result, onRender]);

    return null;
}

TestComponent.propTypes = {
    segment: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    canEditSegment: PropTypes.bool,
    onRender: PropTypes.func.isRequired,
};

describe('useProcessedSegmentText', () => {
    let wrapper;
    let result;
    let enforceRtlMock;

    beforeAll(() => {
        const mockModule = jest.requireMock('../utils');
        enforceRtlMock = mockModule.enforceRtlOnTranscriptTokens;
    });

    const render = (props) => {
        wrapper = mount(
            <TestComponent
                {...props}
                onRender={(r) => {
                    result = r;
                }}
            />
        );
    };

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        result = null;
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

        expect(result.text).toBe('Full text');
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

        expect(result.text).toBe('Public text');
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

        expect(result.text).toBe('Public text only');
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

        expect(result.textDir).toBe('ltr');
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

        expect(result.textDir).toBe('rtl');
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
        expect(result.text).toBe('[RTL]RTL_MARKER النص[/RTL]');
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
        expect(result.text).toBe('Hello world');
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

        expect(result.text).toBeUndefined();
        expect(result.textDir).toBe('ltr');
    });

    it('memoizes result based on segment, contentLocale, and canEditSegment', () => {
        const segment = {
            text: {
                en: 'Hello',
            },
        };

        const { onRender: onRender1, ...props } = {
            segment,
            contentLocale: 'en',
            canEditSegment: true,
            onRender: jest.fn(),
        };

        render({ ...props, onRender: onRender1 });
        const result1 = result;

        // Re-render with same props
        wrapper.setProps({ ...props, onRender: onRender1 });
        const result2 = result;

        expect(result1).toBe(result2);
    });

    it('updates when contentLocale changes', () => {
        const segment = {
            text: {
                en: 'English',
                es: 'Español',
            },
        };

        render({
            segment,
            contentLocale: 'en',
            canEditSegment: true,
        });

        expect(result.text).toBe('English');

        wrapper.setProps({ contentLocale: 'es' });
        expect(result.text).toBe('Español');
    });
});
