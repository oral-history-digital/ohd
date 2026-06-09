import { OHD_LOCATION } from 'modules/constants';

export function localizedText(value, locale) {
    if (!value) return null;
    if (typeof value === 'string') return value;

    return value?.[locale] || Object.values(value).find(Boolean) || null;
}

export function institutionNames(institutions, locale) {
    if (!institutions) return null;

    const list = Array.isArray(institutions) ? institutions : [institutions];
    const names = list
        .map((institution) => {
            const name = localizedText(institution?.name, locale);
            const parentName = localizedText(institution?.parent?.name, locale);
            // If both parent and child names are present, format as "Parent, Child"
            return parentName && name ? `${parentName}, ${name}` : name;
        })
        .filter(Boolean);

    return names.length > 0 ? names.join(', ') : null;
}

export function createLink(url, label = url) {
    if (!url) return null;

    return (
        <a key={url} href={url} target="_blank" rel="noopener noreferrer">
            {label}
        </a>
    );
}

export function catalogLink(type, id, locale, origin = OHD_LOCATION) {
    if (!id || !locale) return null;

    const url = `${origin}/${locale}/catalog/${type}/${id}`;
    return createLink(url);
}

export function joinParts(parts) {
    // First institutions with a colon, then the rest with commas
    const filtered = parts.filter(Boolean);
    if (filtered.length === 0) return null;

    const [institutions, ...rest] = filtered;

    if (rest.length === 0) return institutions;

    return (
        <>
            {institutions}
            {': '}
            {rest.map((part, index) => (
                <span key={index}>
                    {index > 0 && ', '}
                    {part}
                </span>
            ))}
        </>
    );
}

export function normalizedDoiUrl(doiUrl, doi) {
    if (doiUrl) return createLink(doiUrl);
    if (doi) return createLink(`https://doi.org/${doi}`);

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
    console.log('formatProjectCitation called with:', {
        institutions,
        projectName,
        projectId,
        locale,
        origin,
        doi,
        doiUrl,
    });
    const normalizedDoi = normalizedDoiUrl(doiUrl, doi);

    const citation = joinParts([
        institutionNames(institutions, locale),
        localizedText(projectName, locale),
        normalizedDoi || catalogLink('archives', projectId, locale, origin),
    ]);

    return citation;
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
    t,
}) {
    console.log('formatCollectionCitation called with:', {
        institutions,
        projectName,
        collectionName,
        collectionId,
        locale,
        origin,
        doi,
        doiUrl,
    });
    const collectionLabel =
        (typeof t === 'function' && t('activerecord.models.collection.one')) ||
        'Collection';

    const normalizedDoi = normalizedDoiUrl(doiUrl, doi);

    const citation = joinParts([
        institutionNames(institutions, locale),
        localizedText(projectName, locale),
        `${collectionLabel}: ${localizedText(collectionName, locale)}`,
        normalizedDoi ||
            catalogLink('collections', collectionId, locale, origin),
    ]);

    return citation;
}
