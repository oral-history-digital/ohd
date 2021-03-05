import { loadState } from 'modules/persistence';
import { FEATURES_NAME } from 'modules/features';

const persistedState = {
    [FEATURES_NAME]: loadState(FEATURES_NAME),
};

export default persistedState;
