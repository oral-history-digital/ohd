/**
 * This function is needed so that former experimental features that are still
 * saved in local storage are discarded when loaded from local storage.
 */
export default function filterLoadedFeatures(features, availableFeatures) {
    const loadedFeatures = features || {};

    const state = availableFeatures.reduce((acc, featureName) => {
        if (featureName in loadedFeatures) {
            acc[featureName] = loadedFeatures[featureName];
        } else {
            acc[featureName] = false;
        }
        return acc;
    }, {});

    return state;
}
