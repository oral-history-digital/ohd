export function updateRegistryNameAttributes(entry, registryNameTypes, registryEntryAttributes, project, locale) {

    let registryNamesAttributes = registryEntryAttributes.registry_names_attributes || registryEntryAttributes.registry_names;
    registryNamesAttributes ||= [];

    const defaultNameType = Object.values(registryNameTypes).find(r => r.code === 'spelling');

    const alternativeNames = entry.AlternativeNames?.AlternativeName;

    if (Array.isArray(alternativeNames)) { // this means entry comes from Normdata-API
        ['spelling', 'ancient'].map(nameTypeCode => {

            const nameType = Object.values(registryNameTypes).find(r => r.code === nameTypeCode);

            // set original Name
            if (nameTypeCode === 'spelling')
                setDescriptor(entry.Name, registryNamesAttributes, defaultNameType.id, 'orig');

            const isOld = nameTypeCode === 'ancient' ? 'true' : 'false';

            project.available_locales.map( lang => {
                const alternativeName = alternativeNames.find(n => n.Lang === lang && n.IsOld === isOld);
                if (alternativeName) {
                    setDescriptor(alternativeName.Name, registryNamesAttributes, nameType.id, lang);
                }
            })
        })
    } else {
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

export function updateNormDataAttributes(entry, normDataProviders, registryEntryAttributes) {
    let normDataAttributes = registryEntryAttributes.norm_data_attributes || registryEntryAttributes.norm_data;
    normDataAttributes ||= [];

    const normDataProvider = Object.values(normDataProviders).find( p => p.api_name === entry.Provider );

    const normDatum = findOrCreate(normDataAttributes, 'norm_data_provider_id', normDataProvider.id);
    normDatum.nid = entry.ID;

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
