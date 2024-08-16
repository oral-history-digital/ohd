import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function SegmentHeadingForm({
    segment,
    locale,
    projectId,
    project,
    submitData,
    onSubmit,
    onCancel,
}) {
    return (
        <div>
            <Form
                scope='segment'
                onSubmit={(params) => {
                    submitData({ locale, projectId, project }, params);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                data={segment}
                helpTextCode="language_form"
                submitText='submit'
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
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
