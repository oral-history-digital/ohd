import { useState } from 'react';
import { Form } from 'modules/forms';

import { RegistrySearchResultContainer } from 'modules/registry';
import NormDataSelectContainer from './NormDataSelectContainer';
import { useI18n } from 'modules/i18n';

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
    projectId,
    projects,
    locale,
    foundRegistryEntries,
}) {
    const { t } = useI18n();
    const translation = data?.translations_attributes?.find(t => t.locale === locale);
    const [descriptor, setDescriptor] = useState(translation?.descriptor);

    const defaultNameType = Object.values(registryNameTypes).find(r => r.code === 'spelling')

    const isNew = !translation?.descriptor;

    const baseFormElements = [
        {
            elementType: 'select',
            attribute: 'registry_name_type_id',
            value: (data?.registry_name_type_id) || defaultNameType.id,
            values: registryNameTypes && Object.values(registryNameTypes),
            validate: function(v){return /^\d+$/.test(v)}
        },
    ];

    const extendedFormElements = [{
        attribute: 'descriptor',
        multiLocale: true
    }].concat(baseFormElements);

    return (
        <Form
            scope='registry_name'
            onSubmit={params => {
                const paramsWithSelectedEntryValues = {
                    registry_name: Object.assign({}, params.registry_name, {
                        translations_attributes: [{
                            descriptor: descriptor,
                            locale: locale,
                            id: translation?.id,
                        }],
                    })
                };
                submitData({projectId, locale, projects}, paramsWithSelectedEntryValues, index);
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
            elements={isNew ? baseFormElements : extendedFormElements}
        >
            { isNew &&
                <>
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
                    <NormDataSelectContainer
                        setRegistryEntryAttributes={setRegistryEntryAttributes}
                        descriptor={translation?.descriptor}
                        setDescriptor={setDescriptor}
                        registryEntryParent={registryEntryParent}
                    />
                </>
            }
        </Form>
    );
}
