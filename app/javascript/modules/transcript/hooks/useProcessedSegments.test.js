import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';

import { sortedSegmentsWithActiveIndex } from '../utils';
import { useProcessedSegments } from './useProcessedSegments';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../utils', () => ({
    sortedSegmentsWithActiveIndex: jest.fn((activeIndex) => [
        activeIndex,
        [
            { id: 1, speaker_id: 1, speaker: 'Alice', time: '0:00' },
            { id: 2, speaker_id: 1, speaker: 'Alice', time: '0:10' },
            { id: 3, speaker_id: 2, speaker: 'Bob', time: '0:20' },
            { id: 4, speaker_id: null, speaker: 'Unknown', time: '0:30' },
            { id: 5, speaker_id: null, speaker: 'Unknown', time: '0:40' },
            { id: 6, speaker_id: 2, speaker: 'Bob', time: '0:50' },
        ],
    ]),
}));

function HookHarness(props) {
    return <InnerHarness {...props} />;
}

function InnerHarness({ interview, tape, intervieweeId, onRender }) {
    const result = useProcessedSegments(interview, tape, intervieweeId);

    React.useEffect(() => {
        onRender(result);
    }, [result, onRender]);

    return null;
}

InnerHarness.propTypes = {
    interview: PropTypes.object,
    tape: PropTypes.number,
    intervieweeId: PropTypes.number,
    onRender: PropTypes.func.isRequired,
};

describe('useProcessedSegments', () => {
    let wrapper;
    let result;

    const render = (props) => {
        wrapper = mount(
            <HookHarness
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
    });

    it('returns empty array when interview is null', () => {
        render({
            interview: null,
            tape: null,
            intervieweeId: null,
        });
        expect(result).toEqual([]);
    });

    it('returns empty array when interview.segments is undefined', () => {
        render({
            interview: { id: 1 },
            tape: null,
            intervieweeId: null,
        });
        expect(result).toEqual([]);
    });

    it('annotates segments with speaker_is_interviewee flag', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: 1,
        });

        expect(result[0].speaker_is_interviewee).toBe(true);
        expect(result[1].speaker_is_interviewee).toBe(true);
        expect(result[2].speaker_is_interviewee).toBe(false);
    });

    it('marks speakerIdChanged when speaker ID changes', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result[0].speakerIdChanged).toBe(true); // First segment
        expect(result[1].speakerIdChanged).toBe(false); // Same speaker
        expect(result[2].speakerIdChanged).toBe(true); // Different speaker
        expect(result[3].speakerIdChanged).toBe(true); // null speaker with Unknown
        expect(result[4].speakerIdChanged).toBe(false); // Same unknown speaker
        expect(result[5].speakerIdChanged).toBe(true); // Back to speaker 2
    });

    it('marks speakerIdChanged when speaker name changes (with null speaker_id)', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result[3].speakerIdChanged).toBe(true); // Bob (id: 2) to Unknown (id: null)
        expect(result[4].speakerIdChanged).toBe(false); // Unknown to Unknown
    });

    it('recomputes result when interview changes', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 1,
            intervieweeId: 1,
        });

        const firstResult = result;

        wrapper.setProps({
            interview: { id: 2, segments: [{ id: 2 }] },
            tape: 1,
            intervieweeId: 1,
        });

        expect(result).not.toBe(firstResult);
    });

    it('recomputes result when tape changes', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 1,
            intervieweeId: 1,
        });

        const firstResult = result;

        wrapper.setProps({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 2,
            intervieweeId: 1,
        });

        expect(result).not.toBe(firstResult);
    });

    it('recomputes result when intervieweeId changes', () => {
        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 1,
            intervieweeId: 1,
        });

        const firstResult = result;

        wrapper.setProps({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: 1,
            intervieweeId: 2,
        });

        expect(result).not.toBe(firstResult);
    });

    it('marks first segment as changed when speaker is missing', () => {
        sortedSegmentsWithActiveIndex.mockImplementationOnce((activeIndex) => [
            activeIndex,
            [
                {
                    id: 1,
                    speaker_id: null,
                    speaker: undefined,
                    time: '0:00',
                },
                {
                    id: 2,
                    speaker_id: null,
                    speaker: undefined,
                    time: '0:10',
                },
            ],
        ]);

        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result[0].speakerIdChanged).toBe(true);
        expect(result[1].speakerIdChanged).toBe(false);
    });

    it('resets speaker block after a no-speaker segment', () => {
        sortedSegmentsWithActiveIndex.mockImplementationOnce((activeIndex) => [
            activeIndex,
            [
                { id: 1, speaker_id: 1, speaker: 'Alice', time: '0:00' },
                { id: 2, speaker_id: null, speaker: undefined, time: '0:10' },
                { id: 3, speaker_id: 1, speaker: 'Alice', time: '0:20' },
            ],
        ]);

        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result[0].speakerIdChanged).toBe(true);
        expect(result[1].speakerIdChanged).toBe(true);
        expect(result[2].speakerIdChanged).toBe(true);
    });

    it('marks only the first no-speaker segment in a run as changed', () => {
        sortedSegmentsWithActiveIndex.mockImplementationOnce((activeIndex) => [
            activeIndex,
            [
                { id: 1, speaker_id: 1, speaker: 'Alice', time: '0:00' },
                { id: 2, speaker_id: null, speaker: undefined, time: '0:10' },
                { id: 3, speaker_id: null, speaker: undefined, time: '0:20' },
            ],
        ]);

        render({
            interview: { id: 1, segments: [{ id: 1 }] },
            tape: null,
            intervieweeId: null,
        });

        expect(result[0].speakerIdChanged).toBe(true);
        expect(result[1].speakerIdChanged).toBe(true);
        expect(result[2].speakerIdChanged).toBe(false);
    });
});
