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
    // Accept updates to this module
    module.hot.accept();

    // Accept updates to the App component and its dependencies
    module.hot.accept('../startup/App', () => {
        // Re-import the updated App component
        // Note: This uses dynamic import to get the latest version
        import('../startup/App').then((module) => {
            const UpdatedApp = module.default;
            ReactOnRails.register({
                App: UpdatedApp,
            });
        });
    });
}
