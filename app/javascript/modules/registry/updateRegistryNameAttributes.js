export function updateRegistryNameAttributes(entry, registryNameTypes, registryEntryAttributes, project, locale) {

    const registryNamesAttributes = registryEntryAttributes.registry_names_attributes ||= [];
    const alternativeNames = entry.AlternativeNames?.AlternativeName;

    if (alternativeNames) { // this means entry comes from Normdata-API
        ['spelling', 'ancient'].map(nameTypeCode => {

            const { name , nameIndex } = findOrCreateName(registryNameTypes, registryNamesAttributes, nameTypeCode);

            // set original Name
            if (nameTypeCode === 'spelling')
                setDescriptor(entry.Name, registryNameTypes, registryNamesAttributes, 'spelling', 'orig');

            const isOld = nameTypeCode === 'ancient' ? 'true' : 'false';

            project.available_locales.map( lang => {
                const alternativeName = alternativeNames.find(n => n.Lang === lang && n.IsOld === isOld);
                if (alternativeName) {
                    const translation = findOrCreateTranslation(name, lang);
                    translation.descriptor = alternativeName.Name;
                }
            })

            if (name.translations_attributes.length === 0)
                registryNamesAttributes.splice(nameIndex, 1);
        })
    } else {
        setDescriptor(entry.Name, registryNameTypes, registryNamesAttributes, 'spelling', locale);
    }

    return ({registry_names_attributes: registryNamesAttributes});
};

function setDescriptor(value, registryNameTypes, registryNamesAttributes, nameTypeCode, locale) {
    const { name } = findOrCreateName(registryNameTypes, registryNamesAttributes, nameTypeCode);
    const translation = findOrCreateTranslation(name, locale);
    translation.descriptor = value;
};

function findOrCreateName(registryNameTypes, registryNamesAttributes, nameTypeCode) {
    let nameIndex = -1;

    const nameType = Object.values(registryNameTypes).find(r => r.code === nameTypeCode);
    const name = Object.values(registryNamesAttributes).find((r, i) => {
        if (r.registry_name_type_id === nameType.id) {
            nameIndex = i;
            return true;
        }
        return false;
    }) || {
        registry_name_type_id: nameType.id,
        name_position: 1,
        translations_attributes: [],
    };

    if (nameIndex === -1) {
        nameIndex = registryNamesAttributes.length;
        registryNamesAttributes.push(name);
    }

    return {name: name, nameIndex: nameIndex};
};

function findOrCreateTranslation(name, lang) {
    let newTranslation = true;
    const translation = name.translations_attributes.find(t => {
        if (t.locale === lang) {
            newTranslation = false;
            return true;
        }
        return false;
    }) || { locale: lang };

    if (newTranslation) name.translations_attributes.push(translation);

    return translation;
};
