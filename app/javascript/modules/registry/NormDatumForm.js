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
            onSubmit={function(params){submitData({projectId, projects, locale}, params, index);}}
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            formClasses={formClasses}
            data={data}
            nested={nested}
            values={{
                registry_entry_id: (data?.registry_entry_id) || registryEntryId,
                norm_data_provider_id: norm_data_provider_id,
                nid:  nid,
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
