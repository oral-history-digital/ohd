import {
    AVAILABLE_FEATURES,
    FEATURES_NAME,
    filterLoadedFeatures,
} from 'modules/features';
import { loadState } from 'modules/persistence';

const persistedState = {
    [FEATURES_NAME]: filterLoadedFeatures(
        loadState(FEATURES_NAME),
        AVAILABLE_FEATURES
    ),
};

export default persistedState;
