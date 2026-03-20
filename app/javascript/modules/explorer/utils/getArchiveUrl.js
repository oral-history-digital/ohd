export function getArchiveUrl(archive, locale) {
    if (!archive || !locale) return null;
    return archive.archive_domain || `/${archive.shortname}/${locale}`;
}
