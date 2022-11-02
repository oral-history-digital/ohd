import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function PhotoForm({
    interview,
    photo,
    withUpload,
    locale,
    projectId,
    projects,
    submitData,
    onSubmit,
    onCancel,
}) {
    function elements() {
        let elements = [
            {
                attribute: 'public_id',
            },
            {
                attribute: 'caption',
                multiLocale: true,
            },
            {
                attribute: 'place',
                multiLocale: true,
            },
            {
                attribute: 'date',
                multiLocale: true,
            },
            {
                attribute: 'photographer',
                multiLocale: true,
            },
            {
                attribute: 'license',
                multiLocale: true,
            },
        ]

        if (photo?.id) {
            elements.push({
                elementType: 'select',
                attribute: 'workflow_state',
                values: Object.values(photo.workflow_states),
                value: photo.workflow_state,
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
            scope='photo'
            helpTextCode="photo_form"
            onSubmit={params => {
                submitData({ projectId, projects, locale }, params);
                if (onSubmit) {
                    onSubmit();
                }
            }}
            onCancel={onCancel}
            data={photo}
            values={{
                interview_id: interview?.id,
                id: photo?.id
            }}
            elements={elements()}
        />
    );
}

PhotoForm.propTypes = {
    interview: PropTypes.object,
    photo: PropTypes.object,
    withUpload: PropTypes.bool,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
