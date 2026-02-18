import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function NormDatumForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    registryEntryId,
    normDataProviders,
}) {
    const { locale } = useI18n();
    const { project, projectId } = useProject();

    return (
        <Form
            scope="norm_datum"
            helpTextCode="norm_datum_form"
            onSubmit={(params) => {
                // For nested forms, index is used by Form's handleNestedFormSubmit
                // to insert new items at the correct array position. For existing
                // items (Redux action), the index parameter is ignored.
                // Routing between handlers is managed by the forms module.
                submitData({ projectId, locale, project }, params, index);
            }}
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            formClasses={formClasses}
            data={data}
            nested={nested}
            values={{
                registry_entry_id: data?.registry_entry_id || registryEntryId,
                value: data?.norm_data_provider_id,
                value: data?.nid,
            }}
            submitText="submit"
            elements={[
                {
                    attribute: 'norm_data_provider_id',
                    elementType: 'select',
                    value: data?.norm_data_provider_id,
                    values: normDataProviders,
                    validate: function (v) {
                        return /^\d+$/.test(v);
                    },
                    withEmpty: true,
                },
                {
                    attribute: 'nid',
                    value: data?.nid,
                    //validate: function(v){return /^[a-zA-Z0-9-_/]+$/.test(v)},
                },
            ]}
        />
    );
}
