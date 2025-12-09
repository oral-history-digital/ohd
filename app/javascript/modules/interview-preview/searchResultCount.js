export default function searchResultCount(interviewSearchResults) {
    let count = 0;
    if (interviewSearchResults?.found_segments) {
        count +=
            interviewSearchResults.found_segments.length +
            interviewSearchResults.found_headings.length +
            interviewSearchResults.found_registry_entries.length +
            interviewSearchResults.found_biographical_entries.length +
            interviewSearchResults.found_annotations.length +
            interviewSearchResults.found_photos.length +
            interviewSearchResults.found_observations.length;
    }

    return count;
}
