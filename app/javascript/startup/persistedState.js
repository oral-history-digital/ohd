import { loadState } from 'modules/persistence';
import {
    FEATURES_NAME,
    filterLoadedFeatures,
    AVAILABLE_FEATURES,
} from 'modules/features';

const persistedState = {
    [FEATURES_NAME]: filterLoadedFeatures(
        loadState(FEATURES_NAME),
        AVAILABLE_FEATURES
    ),
};

export default persistedState;
