import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function SegmentForm({
    locale,
    projectId,
    projects,
    contentLocale,
    people,
    segment,
    submitData,
    onSubmit,
}) {
    return (
        <div>
            <Form
                scope='segment'
                onSubmit={(params) => { submitData({ locale, projectId, projects }, params); onSubmit(); }}
                data={segment}
                values={{locale: contentLocale}}
                submitText='submit'
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'speaker_id',
                        values: Object.values(people),
                        value: segment?.speaker_id,
                        withEmpty: true,
                        individualErrorMsg: 'empty'
                    },
                    {
                        elementType: 'textarea',
                        value: (segment?.text[contentLocale] || segment?.text[`${contentLocale}-public`]),
                        attribute: 'text',
                    },
                ]}
            />
        </div>
    );
}

SegmentForm.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    people: PropTypes.object.isRequired,
    segment: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
