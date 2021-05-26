import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function SegmentHeadingForm({
    segment,
    locale,
    projectId,
    projects,
    submitData,
    closeArchivePopup,
    onSubmit,
}) {
    return (
        <div>
            <Form
                scope='segment'
                onSubmit={(params) => {
                    submitData({ locale, projectId, projects }, params);
                    closeArchivePopup();
                    if (onSubmit) {
                        onSubmit();
                    }
                }}
                data={segment}
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
    projects: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
};
