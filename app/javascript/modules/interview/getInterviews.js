export function getNextInterview(allArchiveIds, currentArchiveId) {
    const currentIndex = allArchiveIds.indexOf(currentArchiveId);

    if (currentIndex === -1) {
        throw new ReferenceError('currentArchiveId must be in allArchiveIds');
    }

    return allArchiveIds[currentIndex + 1];
}

export function getPreviousInterview(allArchiveIds, currentArchiveId) {
    const currentIndex = allArchiveIds.indexOf(currentArchiveId);

    if (currentIndex === -1) {
        throw new ReferenceError('currentArchiveId must be in allArchiveIds');
    }

    return allArchiveIds[currentIndex - 1];
}
