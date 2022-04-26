import { Form } from 'modules/forms';

export default function NormDatumForm({
    index,
    submitData,
    onSubmitCallback,
    formClasses,
    data,
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
            formClasses={formClasses}
            data={data}
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
