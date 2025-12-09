import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

export default function SegmentHeadingForm({ segment, onSubmit, onCancel }) {
    const { locale } = useI18n();
    const { project, projectId } = useProject();
    const dispatch = useDispatch();

    return (
        <div>
            <Form
                scope="segment"
                onSubmit={(params) => {
                    dispatch(
                        submitData({ locale, projectId, project }, params)
                    );
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                data={segment}
                helpTextCode="language_form"
                submitText="submit"
                elements={[
                    {
                        attribute: 'mainheading',
                        multiLocale: true,
                    },
                    {
                        attribute: 'subheading',
                        multiLocale: true,
                    },
                ]}
            />
        </div>
    );
}

SegmentHeadingForm.propTypes = {
    segment: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
