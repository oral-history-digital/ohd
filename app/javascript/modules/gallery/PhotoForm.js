import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

/**
 * Edits translated photo metadata and uploads through the current project route.
 * @param {Object} props - Record data, form options, and mutation callbacks.
 * @returns {React.ReactElement|null} Editing controls and request feedback.
 */
export default function PhotoForm({
    interview,
    photo,
    withUpload,
    submitData,
    onSubmit,
    onCancel,
}) {
    const pathBase = usePathBase();
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
        ];

        if (photo?.id) {
            elements.push({
                elementType: 'select',
                attribute: 'workflow_state',
                values: Object.values(photo.workflow_states),
                value: photo.workflow_state || 'unshared',
                optionsScope: 'workflow_states',
            });
        }

        if (withUpload) {
            elements.push({
                attribute: 'data',
                elementType: 'input',
                type: 'file',
                validate: function (v) {
                    return v instanceof File;
                },
            });
        }

        return elements;
    }

    return (
        <Form
            scope="photo"
            helpTextCode="photo_form"
            onSubmit={(params) => {
                submitData({ pathBase }, params);
                if (onSubmit) {
                    onSubmit();
                }
            }}
            onCancel={onCancel}
            data={photo}
            values={{
                interview_id: interview?.id,
                id: photo?.id,
            }}
            elements={elements()}
        />
    );
}

PhotoForm.propTypes = {
    interview: PropTypes.object,
    photo: PropTypes.object,
    withUpload: PropTypes.bool,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
