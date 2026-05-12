import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { act } from 'react-dom/test-utils';

import { useTranscriptBookmarks } from './useTranscriptBookmarks';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('modules/workbook', () => ({
    useWorkbook: jest.fn(),
}));

const { useWorkbook } = jest.requireMock('modules/workbook');

function HookHarness(props) {
    return <InnerHarness {...props} />;
}

function InnerHarness({ onRender }) {
    const hook = useTranscriptBookmarks();

    React.useEffect(() => {
        onRender(hook);
    }, [hook, onRender]);

    return null;
}

InnerHarness.propTypes = {
    onRender: PropTypes.func.isRequired,
};

describe('useTranscriptBookmarks', () => {
    let wrapper;
    let hook;

    const render = () => {
        wrapper = mount(
            <HookHarness
                onRender={(h) => {
                    hook = h;
                }}
            />
        );
    };

    beforeEach(() => {
        useWorkbook.mockReturnValue({ savedSegments: [] });
    });

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        hook = null;
        useWorkbook.mockReset();
    });

    it('builds bookmarked segment ids from workbook annotations', () => {
        useWorkbook.mockReturnValue({
            savedSegments: [
                {
                    id: 1,
                    reference_type: 'Segment',
                    reference_id: 10,
                },
                {
                    id: 2,
                    reference_type: 'InterviewReference',
                    reference_id: 999,
                },
                {
                    id: 3,
                    reference_type: 'Segment',
                    reference_id: 20,
                },
            ],
        });

        render();

        expect(hook.bookmarkedSegmentIds.has(10)).toBe(true);
        expect(hook.bookmarkedSegmentIds.has(20)).toBe(true);
        expect(hook.bookmarkedSegmentIds.has(999)).toBe(false);
    });

    it('opens and closes selected bookmark segment', () => {
        render();

        const segment = { id: 77 };

        act(() => {
            hook.handleBookmarkCreate(segment);
        });
        wrapper.update();

        expect(hook.selectedBookmarkSegment).toEqual(segment);

        act(() => {
            hook.handleBookmarkModalClose();
        });
        wrapper.update();

        expect(hook.selectedBookmarkSegment).toBeNull();
    });
});
