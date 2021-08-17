export default function searchResultCount(interviewSearchResults) {
    let count = 0;
    if (interviewSearchResults?.foundSegments) {
        count
            += interviewSearchResults.foundSegments.length
            + interviewSearchResults.foundHeadings.length
            + interviewSearchResults.foundRegistryEntries.length
            + interviewSearchResults.foundBiographicalEntries.length
            + interviewSearchResults.foundAnnotations.length
            + interviewSearchResults.foundPhotos.length
            + interviewSearchResults.foundObservations.length;
    }

    return count;
}
