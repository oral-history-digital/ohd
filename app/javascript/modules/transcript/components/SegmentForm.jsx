import { Form } from 'modules/forms';
import { useInterviewContributors } from 'modules/person';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

export default function SegmentForm({
    locale,
    projectId,
    project,
    contentLocale,
    segment,
    submitData,
    onSubmit,
    onCancel,
    onChange,
}) {
    const interviewId = segment?.interview_id;
    const { data: people, isLoading } = useInterviewContributors(interviewId);

    if (isLoading) {
        return <Spinner />;
    }

    const submitHandler = (params) => {
        submitData({ locale, projectId, project }, params);
        onSubmit();
    };

    const formElements = [
        {
            elementType: 'textarea',
            value:
                segment?.text[contentLocale] ||
                segment?.text[`${contentLocale}-public`],
            attribute: `text_${contentLocale}`,
            labelKey: 'activerecord.attributes.segment.text',
        },
        {
            elementType: 'select',
            attribute: 'speaker_id',
            values: Object.values(people),
            value: segment?.speaker_id,
            withEmpty: true,
            individualErrorMsg: 'empty',
            group: 'secondary',
        },
        {
            elementType: 'input',
            attribute: 'timecode',
            value: segment?.timecode || '',
            withEmpty: false,
            individualErrorMsg: 'empty',
            group: 'secondary',
        },
    ];

    return (
        <div>
            <Form
                scope="segment"
                onSubmit={submitHandler}
                onCancel={onCancel}
                onChange={onChange}
                data={segment}
                values={{ locale: contentLocale }}
                submitText="submit"
                elements={formElements}
            />
        </div>
    );
}

SegmentForm.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    segment: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
};
