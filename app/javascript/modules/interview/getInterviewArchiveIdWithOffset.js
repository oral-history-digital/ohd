export default function getInterviewArchiveIdWithOffset(archiveId, foundInterviews, sortedArchiveIds, offset = 1) {
    if (foundInterviews && sortedArchiveIds) {
        let listOfArchiveIds = foundInterviews.map(x => x.archive_id);
        let positionInList = listOfArchiveIds.findIndex(i => i === archiveId)
        // use sortedArchiveIds if archiveId not in foundInterviews
        if (positionInList === -1) {
            listOfArchiveIds = sortedArchiveIds
            positionInList = sortedArchiveIds.findIndex(i => i === archiveId)
        }
        let offsetItem = listOfArchiveIds[positionInList + offset]
        if (listOfArchiveIds.length > 1 && positionInList > -1 && offsetItem) {
            return offsetItem
        } else {
            return false;
        }
    }
}
