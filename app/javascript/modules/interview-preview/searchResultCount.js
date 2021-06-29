import { numObservationsResults } from 'modules/search';

export default function searchResultCount(interviewSearchResults, observations, searchTerm) {
    let count = 0;
    if (interviewSearchResults?.foundSegments) {
        count
            += interviewSearchResults.foundSegments.length
            + interviewSearchResults.foundRegistryEntries.length
            + interviewSearchResults.foundBiographicalEntries.length
            + interviewSearchResults.foundAnnotations.length
            + interviewSearchResults.foundPhotos.length;
    }

    if (observations) {
        count += numObservationsResults(observations, searchTerm);
    }

    return count;
}
