import 'core-js/stable';
import 'datalist-polyfill';
import 'intersection-observer';
import ReactOnRails from 'react-on-rails';
import 'regenerator-runtime/runtime';
import App from 'startup/App';

ReactOnRails.register({
    App,
});

// Enable Hot Module Replacement (HMR) with React Fast Refresh
if (module.hot) {
    // Cleanup before module is replaced
    module.hot.dispose(() => {
        console.log('[HMR] Disposing old App…');

        try {
            // Unmount the previously mounted root to avoid leaking DOM nodes, effects, and stores
            ReactOnRails.unmountComponent('App');
        } catch (e) {
            console.warn('[HMR] Failed to unmount App:', e);
        }

        try {
            // Clear Redux / MobX / ReactOnRails hydrated stores if used
            ReactOnRails.clearHydratedStores();
        } catch (e) {
            console.warn('[HMR] Failed to clear stores:', e);
        }
    });

    // Accept updates to the App and its dependencies
    module.hot.accept('../startup/App', () => {
        import('../startup/App').then((module) => {
            const UpdatedApp = module.default;

            // Re-register the updated component so ReactOnRails mounts the new version
            ReactOnRails.register({
                App: UpdatedApp,
            });

            console.log('[HMR] Updated App reloaded.');
        });
    });
}
