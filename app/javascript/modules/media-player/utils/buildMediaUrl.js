export function buildMediaUrl(path, pathBase, archiveId, tape, resolution) {
    const splittedPath = path.split('.');
    const suffix = splittedPath[splittedPath.length - 1];
    const url = `${pathBase}/media_streams/${archiveId}/${tape}/${resolution}.${suffix}`;
    return url;
}
