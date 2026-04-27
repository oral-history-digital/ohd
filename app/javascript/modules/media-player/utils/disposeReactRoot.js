/**
 * Unmount a React root on the next tick instead of synchronously.
 *
 * This avoids React warnings when Video.js tears down controls while
 * React is still in the middle of a render during route transitions.
 */
export function disposeReactRoot(root) {
    if (!root) {
        return;
    }

    setTimeout(() => {
        root.unmount();
    }, 0);
}
