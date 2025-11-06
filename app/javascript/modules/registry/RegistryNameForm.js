import { useEffect } from 'react';
import { Form } from 'modules/forms';

import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import RegistrySearchResult from './RegistrySearchResult';

export default function RegistryNameForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    registryNameTypes,
    foundRegistryEntries,
    searchRegistryEntry,
    setDescriptor,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const pathBase = usePathBase();

    useEffect(() => {
        searchRegistryEntry(`${pathBase}/searches/registry_entry`, {});
    }, []);

    const defaultNameType = Object.values(registryNameTypes).find(
        (r) => r.code === 'spelling'
    );

    const handleDescriptorChange = (name, value, params) => {
        setDescriptor(value);
        if (!registryEntryId && value?.length > 3) {
            searchRegistryEntry(`${pathBase}/searches/registry_entry`, {
                fulltext: value,
            });
        }
    };

    const formElements = [
        {
            elementType: 'select',
            attribute: 'registry_name_type_id',
            value: data?.registry_name_type_id || defaultNameType.id,
            values: registryNameTypes && Object.values(registryNameTypes),
            validate: function (v) {
                return /^\d+$/.test(v);
            },
        },
        {
            attribute: 'descriptor',
            multiLocale: true,
            validate: function (v) {
                return v && v.length > 1;
            },
            handlechangecallback: handleDescriptorChange,
            origAsLocale: true,
        },
    ];

    return (
        <Form
            scope="registry_name"
            onSubmit={(params) => {
                submitData({ projectId, locale, project }, params);
            }}
            helpTextCode="registry_name_form"
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            formClasses={formClasses}
            data={data}
            nested={nested}
            values={{
                registry_entry_id: data?.registry_entry_id || registryEntryId,
                registry_name_type_id:
                    data?.registry_name_type_id || defaultNameType.id,
                name_position: 1,
                translations_attributes: data?.translations_attributes || [],
            }}
            submitText="submit"
            elements={formElements}
        >
            {!registryEntryId && foundRegistryEntries?.results?.length > 0 && (
                <>
                    <h6>{`${t('existing_registry_entries')}:`}</h6>
                    <ul className="RegistryEntryList RegistryEntryList--root">
                        {foundRegistryEntries?.results?.map((result) => (
                            <RegistrySearchResult
                                key={result.id}
                                result={result}
                                hideCheckbox
                                hideEditButtons
                            />
                        ))}
                    </ul>
                </>
            )}
        </Form>
    );
}
