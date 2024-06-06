import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function SingleTextInputForm({
    index,
    submitData,
    onSubmitCallback,
    onCancel,
    formClasses,
    data,
    nested,
}) {
    const { project, projectId } = useProject();
    const { locale } = useI18n();

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
