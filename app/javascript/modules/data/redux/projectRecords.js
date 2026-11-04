export const localizedProjectFields = [
    'name',
    'display_name',
    'introduction',
    'more_text',
    'logo',
    'institutions',
    'collection_preview',
    'subjects',
    'levels_of_indexing',
    'cooperation_partners',
    'leaders',
    'managers',
    'funders',
    'metadata_fields',
    'external_links',
    'sponsor_logos',
    'media_missing_text',
    'texts',
    'map_sections',
];

// Form and registry configuration has the same shape in both profiles and stays shared.
const editFields = [
    'contact_email',
    'doi_status',
    'fullname_on_landing_page',
    'show_legend',
    'pdf_registry_entry_ids',
];
const editIncludeFields = {
    access_config: ['access_config'],
    metadata_fields: ['metadata_fields'],
    playback: ['media_streams'],
    affiliates: ['cooperation_partners', 'leaders', 'managers', 'funders'],
    branding: ['logos', 'sponsor_logos'],
    external_links: ['external_links'],
    institution_projects: ['institution_projects'],
    texts: ['texts'],
};

/**
 * Identifies fields whose edit representation must stay separate from display data.
 * Footer-only reads keep their display shape, even with profile=edit.
 *
 * @param {string[]} [include=[]] - Requested includes.
 * @returns {string[]} Editor settings and fields extended by these includes.
 */
export function projectEditFields(include = []) {
    return [
        ...editFields,
        ...include.flatMap((name) => editIncludeFields[name] || []),
    ];
}

/**
 * Combines shared and localized fields with the requested editing or email-preview values.
 * Stored project translations retain their own array without display fallback.
 *
 * @param {Object|undefined} projects - Project state branch.
 * @param {number|string} id - Project ID.
 * @param {string} locale - Requested locale.
 * @param {'display'|'edit'} [profile='display'] - Representation to read.
 * @param {string[]} [include=[]] - Includes confirmed by the detail request.
 * @returns {Object|undefined} Selected project, or undefined before locale data exists.
 */
export function readProjectRecord(
    projects,
    id,
    locale,
    profile = 'display',
    include = []
) {
    const record = projects?.records[id];
    const display = projects?.translations.display[id]?.[locale];
    if (!record || !display) return undefined;
    const { edit, ...shared } = record;
    const result = { ...shared, ...display };
    if (profile === 'display' && include.includes('email_preview'))
        result.contact_email = edit?.contact_email;
    if (profile === 'edit') {
        const localizedEdit = projects.translations.edit[id]?.[locale];
        for (const field of projectEditFields(include)) {
            if (Object.hasOwn(localizedEdit || {}, field))
                result[field] = localizedEdit[field];
            else if (Object.hasOwn(edit || {}, field))
                result[field] = edit[field];
        }
        if (include.includes('translations'))
            result.translations = projects.translations.stored[id];
    }
    return result;
}
