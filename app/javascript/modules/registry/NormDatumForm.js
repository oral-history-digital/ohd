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
    projectId,
    projects,
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
            }}
            submitText='submit'
            elements={[
                {
                    attribute: 'provider',
                },
                {
                    attribute: 'nid',
                },
            ]}
        />
    );
}
