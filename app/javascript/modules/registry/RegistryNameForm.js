import { useState, useEffect } from 'react';
import { Form } from 'modules/forms';

import { RegistrySearchResultContainer } from 'modules/registry';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function RegistryNameForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    registryEntryParent,
    registryNameTypes,
    normDataProviders,
    setRegistryEntryAttributes,
    registryEntryAttributes,
    projectId,
    projects,
    locale,
    foundRegistryEntries,
    searchRegistryEntry,
    setDescriptor,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    useEffect(() => {
        searchRegistryEntry(`${pathBase}/searches/registry_entry`, {});
    }, [])

    const defaultNameType = Object.values(registryNameTypes).find(r => r.code === 'spelling')

    const handleDescriptorChange = (name, value, params) => {
        setDescriptor(value);
        const registryNamesAttributes = registryEntryAttributes.registry_names_attributes || [data] || [];
        const registryNamesIndex = 0;
        const translationsAttributes = registryNamesAttributes[registryNamesIndex]?.translations_attributes || [];
        let translationIndex = translationsAttributes.findIndex(t => t.locale === params.locale);
        translationIndex = translationIndex === -1 ? 0 : translationIndex;
        const translation = translationsAttributes[translationIndex];
        setRegistryEntryAttributes({
            registry_names_attributes: Object.assign([], registryNamesAttributes, {
                [registryNamesIndex]: Object.assign({}, registryNamesAttributes[registryNamesIndex], {
                    registry_name_type_id: defaultNameType.id,
                    name_position: 1,
                    translations_attributes: Object.assign([], translationsAttributes, {
                        [translationIndex]: Object.assign({}, translation, {
                            descriptor: value,
                            locale: translation?.locale || params.locale,
                            id: translation?.id,
                        })
                    }),
                })
            })
        });
        if (value?.length > 3) {
            searchRegistryEntry(`${pathBase}/searches/registry_entry`, {fulltext: value});
        }
    }

    const formElements = [
        {
            attribute: 'descriptor',
            multiLocale: true,
            validate: function(v){return v && v.length > 1},
            handlechangecallback: handleDescriptorChange,
        },
        {
            elementType: 'select',
            attribute: 'registry_name_type_id',
            value: (data?.registry_name_type_id) || defaultNameType.id,
            values: registryNameTypes && Object.values(registryNameTypes),
            validate: function(v){return /^\d+$/.test(v)},
        },
    ]

    return (
        <Form
            scope='registry_name'
            onSubmit={params => {
                submitData({projectId, locale, projects}, params, index);
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            formClasses={formClasses}
            data={data}
            nested={nested}
            values={{
                registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                registry_name_type_id: (data?.registry_name_type_id) || defaultNameType.id,
                name_position: 1,
            }}
            submitText='submit'
            elements={formElements}
        >
            { foundRegistryEntries?.results?.length > 0 &&
                <>
                    <h6>{`${t('existing_registry_entries')}:`}</h6>
                    <ul className="RegistryEntryList RegistryEntryList--root">
                        {
                            foundRegistryEntries?.results?.map(result => <RegistrySearchResultContainer key={result.id} result={result} hideCheckbox />)
                        }
                    </ul>
                </>
            }
        </Form>
    );
}
