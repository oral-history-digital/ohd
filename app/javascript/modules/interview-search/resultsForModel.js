import { pluralize } from 'modules/strings';

export default function resultsForModel(searchResults, modelName) {
    return searchResults[`found${pluralize(modelName)}`];
}
