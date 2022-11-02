export function updateRegistryNameAttributes(value, nameTypeId, registryEntryAttributes, data, locale) {
    const registryNamesAttributes = registryEntryAttributes.registry_names_attributes || [data] || [];
    const registryNamesIndex = 0;
    const translationsAttributes = registryNamesAttributes[registryNamesIndex]?.translations_attributes || [];
    let translationIndex = translationsAttributes.findIndex(t => t.locale === locale);
    translationIndex = translationIndex === -1 ?
        (translationsAttributes.length === 0 ? 0 : translationsAttributes.length) :
        translationIndex;
    const translation = translationsAttributes[translationIndex];
    return ({
        registry_names_attributes: Object.assign([], registryNamesAttributes, {
            [registryNamesIndex]: Object.assign({}, registryNamesAttributes[registryNamesIndex], {
                registry_name_type_id: nameTypeId,
                name_position: 1,
                translations_attributes: Object.assign([], translationsAttributes, {
                    [translationIndex]: Object.assign({}, translation, {
                        descriptor: value,
                        locale: translation?.locale || locale,
                        id: translation?.id,
                    })
                }),
            })
        })
    });
};
