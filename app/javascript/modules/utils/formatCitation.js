import { OHD_LOCATION } from 'modules/constants';

function localizedText(value, locale) {
    if (!value) return null;
    if (typeof value === 'string') return value;

    return value?.[locale] || Object.values(value).find(Boolean) || null;
}

function institutionNames(institutions, locale) {
    if (!institutions) return null;

    const list = Array.isArray(institutions) ? institutions : [institutions];
    const names = list
        .map((institution) => localizedText(institution?.name, locale))
        .filter(Boolean);

    return names.length > 0 ? names.join(', ') : null;
}

function catalogLink(type, id, locale, origin = OHD_LOCATION) {
    if (!id || !locale) return null;

    return `${origin}/${locale}/catalog/${type}/${id}`;
}

function joinParts(parts) {
    // First institutions with a colon, then the rest with commas
    const [institutions, ...rest] = parts.filter(Boolean);
    if (!institutions) return rest.join(', ');
    if (rest.length === 0) return institutions;

    return `${institutions}: ${rest.join(', ')}`;
}

function appendDoi(citation, doiUrl) {
    if (!doiUrl) return citation;
    if (!citation) return `DOI: ${doiUrl}`;

    return `${citation}, DOI: ${doiUrl}`;
}

function normalizedDoiUrl(doiUrl, doi) {
    if (doiUrl) return doiUrl;
    if (doi) return `https://doi.org/${doi}`;

    return null;
}

export function formatProjectCitation({
    institutions,
    projectName,
    projectId,
    locale,
    origin,
    doi,
    doiUrl,
}) {
    const citation = joinParts([
        institutionNames(institutions, locale),
        localizedText(projectName, locale),
        catalogLink('archives', projectId, locale, origin),
    ]);

    return appendDoi(citation, normalizedDoiUrl(doiUrl, doi));
}

export function formatCollectionCitation({
    institutions,
    projectName,
    collectionName,
    collectionId,
    locale,
    origin,
    doi,
    doiUrl,
}) {
    const citation = joinParts([
        institutionNames(institutions, locale),
        localizedText(projectName, locale),
        localizedText(collectionName, locale),
        catalogLink('collections', collectionId, locale, origin),
    ]);

    return appendDoi(citation, normalizedDoiUrl(doiUrl, doi));
}
