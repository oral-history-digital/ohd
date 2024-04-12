export default function saveSessionState(key, state) {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem(key, serializedState);
    } catch (err) {
        // Ignore write errors.
    }
}
