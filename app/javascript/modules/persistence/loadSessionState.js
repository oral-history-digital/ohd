export default function loadSessionState(key) {
    try {
        const serializedState = sessionStorage.getItem(key);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}
