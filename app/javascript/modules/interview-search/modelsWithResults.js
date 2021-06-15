import { MODEL_NAMES } from './constants';
import resultsForModel from './resultsForModel';

export default function modelsWithResults(searchResults) {
    const filteredNames = MODEL_NAMES
        .filter(name => {
            if (!searchResults) {
                return false;
            }

            return resultsForModel(searchResults, name)?.length > 0;
        });
    return filteredNames;
}
