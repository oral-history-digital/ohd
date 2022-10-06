import { Form } from 'modules/forms';

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
    projectId,
    projects,
    normDataProviders,
    locale,
}) {

    return (
        <Form
            scope='norm_datum'
            onSubmit={params => {
                const paramsWithSelectedEntryValues = {
                    norm_datum: Object.assign({}, params.norm_datum, {
                        registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                        norm_data_provider_id: norm_data_provider_id,
                        nid:  nid,
                    }),
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
            }}
            submitText='submit'
            elements={[
                {
                    attribute: 'norm_data_provider_id',
                    elementType: 'select',
                    value: norm_data_provider_id,
                    values: normDataProviders,
                    withEmpty: true,
                },
                {
                    attribute: 'nid',
                    value: nid,
                },
            ]}
        />
    );
}
