import reducer from './reducer';

const initialState = {
    Segment: false,
    Person: false,
};

test('does nothing with unknown action', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
});

describe('TOGGLE action', () => {
    it('works one way', () => {
        const state = initialState;
        const action = {
            type: 'TOGGLE',
            payload: 'Segment',
        };
        const expectedState = {
            ...initialState,
            Segment: true,
        };
        expect(reducer(state, action)).toEqual(expectedState);
    });

    it('works the other way', () => {
        const state = {
            ...initialState,
            Segment: true,
        };
        const action = {
            type: 'TOGGLE',
            payload: 'Segment',
        };
        const expectedState = initialState;
        expect(reducer(state, action)).toEqual(expectedState);
    });
});
