export function prepareRegistryNameAttributes(
    entry,
    registryNameTypes,
    project
) {
    let registryNamesAttributes = [];

    const defaultNameType = Object.values(registryNameTypes).find(
        (r) => r.code === 'spelling'
    );
    const ancientNameType = Object.values(registryNameTypes).find(
        (r) => r.code === 'ancient'
    );
    const langOrig = entry.Country?.toLowerCase();

    project.available_locales.map((lang) => {
        if (Array.isArray(entry.AlternativeNames?.AlternativeName)) {
            const alternateName = entry.AlternativeNames?.AlternativeName.find(
                (n) => n.Lang === lang && n.Name
            )?.Name;
            if (alternateName)
                setDescriptor(
                    alternateName,
                    registryNamesAttributes,
                    defaultNameType.id,
                    lang
                );
        }
        if (Array.isArray(entry.Alias)) {
            const alias = entry.Alias.find(
                (n) => n.Lang === lang && n.Alias
            )?.Alias;
            if (alias)
                setDescriptor(
                    alias,
                    registryNamesAttributes,
                    ancientNameType.id,
                    lang
                );
        }
    });

    let originalName;
    if (Array.isArray(entry.AlternativeNames?.AlternativeName)) {
        originalName = entry.AlternativeNames?.AlternativeName.find(
            (n) => n.Lang === langOrig && n.Name
        )?.Name;
    }
    originalName = originalName || entry.Name;
    if (originalName)
        setDescriptor(
            originalName,
            registryNamesAttributes,
            defaultNameType.id,
            'orig'
        );

    const origAlias =
        Array.isArray(entry.Alias) &&
        entry.Alias.find((n) => n.Lang === langOrig && n.Alias)?.Alias;
    if (origAlias)
        setDescriptor(
            origAlias,
            registryNamesAttributes,
            ancientNameType.id,
            'orig'
        );

    return registryNamesAttributes;
}

export function setDescriptor(
    value,
    registryNamesAttributes,
    nameTypeId,
    locale
) {
    const name = findOrCreate(
        registryNamesAttributes,
        'registry_name_type_id',
        nameTypeId
    );
    name.name_position ||= 1;
    name.translations_attributes ||= [];
    const translation = findOrCreate(
        name.translations_attributes,
        'locale',
        locale
    );
    translation.descriptor = Array.isArray(value) ? value[0] : value;
}

export function updateRegistryEntryTranslationsAttributes(entry, project) {
    let translationsAttributes = [];

    project.available_locales.map((lang) => {
        const description = Array.isArray(entry.Description)
            ? entry.Description.find((n) => n.Lang === lang && n.Description)
                  ?.Description
            : entry.Description?.Description;

        if (description) {
            const translation = findOrCreate(
                translationsAttributes,
                'locale',
                lang
            );
            translation.notes = description;
        }
    });

    return { translations_attributes: translationsAttributes };
}

export function prepareNormDataAttributes(entry, normDataProviders) {
    let normDataAttributes = [];

    entry.Identifier.map((provider) => {
        if (provider.Value) {
            const normDataProvider = Object.values(normDataProviders).find(
                (p) => p.name === provider.Provider
            );
            const normDatum = findOrCreate(
                normDataAttributes,
                'norm_data_provider_id',
                normDataProvider.id
            );
            normDatum.nid = provider.Value;
        }
    });

    return normDataAttributes;
}

export function findOrCreate(
    attributes,
    selectPropertyName,
    selectedPropertyValue
) {
    let isNew = true;
    const datum = attributes.find((t) => {
        if (t[selectPropertyName] === selectedPropertyValue) {
            isNew = false;
            return true;
        }
        return false;
    }) || { [selectPropertyName]: selectedPropertyValue };

    if (isNew) attributes.push(datum);

    datum.creation_date ||= new Date().toISOString();
    return datum;
}
