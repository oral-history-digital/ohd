import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function PDFForm({
    interview,
    pdf,
    withUpload,
    onSubmit,
    onCancel,
}) {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const { projectId, project } = useProject();

    function elements() {
        let elements = [
            {
                attribute: 'title',
                multiLocale: true,
            },
            {
                attribute: 'language',
            },
        ];

        if (pdf?.id) {
            elements.push({
                elementType: 'select',
                attribute: 'workflow_state',
                values: ['unshared', 'public'],
                value: pdf.workflow_state || 'unshared',
                optionsScope: 'workflow_states',
            })
        }

        if (withUpload) {
            elements.push({
                attribute: 'data',
                elementType: 'input',
                type: 'file',
                validate: function(v){return v instanceof File},
            })
        }

        return elements;
    }

    return (
        <Form
            scope="pdf"
            helpTextCode="pdf_form"
            onSubmit={params => {
                dispatch(submitData({ projectId, project, locale }, params));
                if (onSubmit) {
                    onSubmit();
                }
            }}
            onCancel={onCancel}
            data={pdf}
            values={{
                interview_id: interview?.id,
                id: pdf?.id
            }}
            elements={elements()}
        />
    );
}

PDFForm.propTypes = {
    interview: PropTypes.object,
    pdf: PropTypes.object,
    withUpload: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
