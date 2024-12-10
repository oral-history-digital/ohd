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
    norm_data_provider_id,
    nid,
    normDataProviders,
}) {

    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    return (
        <Form
            scope='norm_datum'
            helpTextCode="norm_datum_form"
            onSubmit={params => {
                const paramsWithSelectedEntryValues = {
                    norm_datum: Object.assign({}, params.norm_datum, {
                        registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                        norm_data_provider_id: norm_data_provider_id,
                        nid:  nid,
                    }),
                };
                submitData({projectId, locale, project}, nid ? paramsWithSelectedEntryValues : params, index);
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
            }}
            submitText='submit'
            elements={[
                {
                    attribute: 'norm_data_provider_id',
                    elementType: 'select',
                    value: norm_data_provider_id,
                    values: normDataProviders,
                    validate: function(v){return /^\d+$/.test(v)},
                    withEmpty: true,
                },
                {
                    attribute: 'nid',
                    value: nid,
                    validate: function(v){return /^[a-zA-Z0-9-_/]+$/.test(v)},
                },
            ]}
        />
    );
}
