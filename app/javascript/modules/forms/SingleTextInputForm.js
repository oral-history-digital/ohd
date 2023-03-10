import { Form } from 'modules/forms';

export default function SingleTextInputForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
    projectId,
    project,
    locale,
}) {
    return (
        <Form
            scope='text'
            onSubmit={params => {
                submitData({projectId, project, locale}, params, index);
            }}
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            data={data}
            nested={nested}
            formClasses={formClasses}
            elements={[
                {attribute: 'text_to_mark'},
                {attribute: 'replacement'}
            ]}
        />
    );
}
