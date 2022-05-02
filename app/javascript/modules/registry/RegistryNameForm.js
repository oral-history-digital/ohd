import { Form } from 'modules/forms';

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
    projectId,
    projects,
    locale,
}) {
    const defaultNameType = Object.values(registryNameTypes).find(r => r.code === 'spelling')

    return (
        <Form
            scope='registry_name'
            onSubmit={function(params){submitData({projectId, projects, locale}, params, index);}}
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
            elements={[
                {
                    attribute: 'descriptor',
                    multiLocale: true
                },
                {
                    elementType: 'textarea',
                    multiLocale: true,
                    attribute: 'notes',
                },
                {
                    elementType: 'select',
                    attribute: 'registry_name_type_id',
                    value: (data?.registry_name_type_id) || defaultNameType.id,
                    values: registryNameTypes && Object.values(registryNameTypes),
                    validate: function(v){return /^\d+$/.test(v)}
                },
            ]}
        />
    );
}
