export function updateRegistryNameAttributes(entry, registryNameTypes, registryEntryAttributes, project, locale) {

    let registryNamesAttributes = registryEntryAttributes.registry_names_attributes || registryEntryAttributes.registry_names;
    registryNamesAttributes ||= [];

    if (Array.isArray(entry.AlternateName)) { // this means entry comes from Normdata-API
        ['spelling', 'ancient'].map(nameTypeCode => {

            const nameType = Object.values(registryNameTypes).find(r => r.code === nameTypeCode);

            // set original Name
            if (nameTypeCode === 'spelling')
                setDescriptor(entry.Name, registryNamesAttributes, nameType.id, 'orig');

            const isOld = nameTypeCode === 'ancient' ? 'true' : 'false';

            project.available_locales.map( lang => {
                //const alternateName = entry.AlternateName.find(n => n.Lang === lang && n.IsOld === isOld);
                const alternateName = Array.isArray(entry.AlternateName) ?
                    entry.AlternateName.find(n => n.Lang === lang && n.Name)?.Name :
                    entry.AlternateName?.Name;

                if (alternateName) {
                    setDescriptor(alternateName, registryNamesAttributes, nameType.id, lang);
                }
            })
        })
    } else {
        const defaultNameType = Object.values(registryNameTypes).find(r => r.code === 'spelling');
        setDescriptor(entry.Name, registryNamesAttributes, entry.nameTypeId || defaultNameType.id, locale);
    }

    return ({registry_names_attributes: registryNamesAttributes});
};

export function setDescriptor(value, registryNamesAttributes, nameTypeId, locale) {
    const name = findOrCreate(registryNamesAttributes, 'registry_name_type_id', nameTypeId);
    name.name_position ||= 1;
    name.translations_attributes ||= [];
    const translation = findOrCreate(name.translations_attributes, 'locale', locale);
    translation.descriptor = value;
};

export function updateRegistryEntryTranslationsAttributes(entry, registryEntryAttributes, project) {
    let translationsAttributes = registryEntryAttributes.translations_attributes || registryEntryAttributes.translations;
    translationsAttributes ||= [];

    project.available_locales.map( lang => {
        const description = Array.isArray(entry.Description) ?
            entry.Description.find(n => n.Lang === lang && n.Description)?.Description :
            entry.Description?.Description;

        if (description) {
            const translation = findOrCreate(translationsAttributes, 'locale', lang);
            translation.notes = description;
        }
    })

    return ({translations_attributes: translationsAttributes});
}

export function updateNormDataAttributes(entry, normDataProviders, registryEntryAttributes) {
    let normDataAttributes = registryEntryAttributes.norm_data_attributes || registryEntryAttributes.norm_data;
    normDataAttributes ||= [];

    entry.Identifier.map(provider => {
        if (provider.Value) {
            const normDataProvider = Object.values(normDataProviders).find(p => p.name === provider.Provider);
            const normDatum = findOrCreate(normDataAttributes, 'norm_data_provider_id', normDataProvider.id);
            normDatum.nid = provider.Value;
        }
    });

    return ({norm_data_attributes: normDataAttributes});
}

export function findOrCreate(attributes, selectPropertyName, selectedPropertyValue) {
    let isNew = true;
    const datum = attributes.find(t => {
        if (t[selectPropertyName] === selectedPropertyValue) {
            isNew = false;
            return true;
        }
        return false;
    }) || { [selectPropertyName]: selectedPropertyValue };

    if (isNew) attributes.push(datum);

    return datum;
};
