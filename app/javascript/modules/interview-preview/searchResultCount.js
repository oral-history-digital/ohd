export default function searchResultCount(interviewSearchResults) {
    console.log(interviewSearchResults);

    let count = 0;
    if (interviewSearchResults?.foundSegments) {
        count
            += interviewSearchResults.foundSegments.length
            + interviewSearchResults.foundRegistryEntries.length
            + interviewSearchResults.foundBiographicalEntries.length
            + interviewSearchResults.foundAnnotations.length
            + interviewSearchResults.foundPhotos.length;
    }
    return count;
}
