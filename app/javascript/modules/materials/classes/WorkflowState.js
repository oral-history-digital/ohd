export default class WorkflowState {
    static states = ['public', 'unshared'];

    constructor(state) {
        if (!WorkflowState.states.includes(state)) {
            throw new Error('Not a valid state');
        }

        this._state = state;
    }

    toString() {
        return this._state;
    }
}
