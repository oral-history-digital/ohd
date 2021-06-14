export default function reducer(state, action) {
    switch (action.type) {
        case 'TOGGLE':
            return {
                ...state,
                [action.payload]: !state[action.payload],
            };
        default:
            return state;
    }
}
