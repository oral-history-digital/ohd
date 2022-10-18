import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { usePeople } from 'modules/person';
import { Spinner } from 'modules/spinners';

export default function SegmentForm({
    locale,
    projectId,
    projects,
    contentLocale,
    segment,
    submitData,
    onSubmit,
    onCancel,
}) {
    const { data: people, isLoading } = usePeople();

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <Form
                scope='segment'
                onSubmit={(params) => { submitData({ locale, projectId, projects }, params); onSubmit(); }}
                onCancel={onCancel}
                data={segment}
                helpTextCode="segment_form"
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
    segment: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
