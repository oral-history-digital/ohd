import { useState } from 'react';

import { Form } from 'modules/forms';
import {
    validateTimecode,
    validateTimecodeInRange,
} from 'modules/forms/utils/validators';
import { useI18n } from 'modules/i18n';
import { useInterviewContributors } from 'modules/person';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import { getTimecodeHelpText } from '../utils';

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
    prevSegmentTimecode,
    nextSegmentTimecode,
}) {
    const interviewId = segment?.interview_id;
    const { data: people, isLoading } = useInterviewContributors(interviewId);
    const { t } = useI18n();
    const [timecodeError, setTimecodeError] = useState(
        'invalid_timecode_range'
    );

    if (isLoading) {
        return <Spinner />;
    }

    const submitHandler = (params) => {
        submitData({ locale, projectId, project }, params);
        onSubmit();
    };

    const timecodeValidationHandler = (value) => {
        if (!validateTimecode(value)) {
            setTimecodeError('invalid_format');
            return false;
        }
        if (
            !validateTimecodeInRange(
                value,
                prevSegmentTimecode,
                nextSegmentTimecode
            )
        ) {
            setTimecodeError('invalid_timecode_range');
            return false;
        }
        return true;
    };

    const formElements = [
        {
            elementType: 'textarea',
            value:
                segment?.text[contentLocale] ||
                segment?.text[`${contentLocale}-public`],
            attribute: `text_${contentLocale}`,
            labelKey: 'edit.segment.text',
        },
        {
            elementType: 'select',
            attribute: 'speaker_id',
            values: Object.values(people || {}),
            value: segment?.speaker_id,
            withEmpty: true,
            individualErrorMsg: 'empty',
            group: 'secondary',
            labelKey: 'edit.segment.speaker',
        },
        {
            elementType: 'input',
            attribute: 'timecode',
            group: 'secondary',
            value: segment?.timecode || '',
            withEmpty: false,
            validate: timecodeValidationHandler,
            individualErrorMsg: timecodeError,
            labelKey: 'edit.segment.timecode',
            help: getTimecodeHelpText(
                t,
                prevSegmentTimecode,
                nextSegmentTimecode
            ),
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
    prevSegmentTimecode: PropTypes.string,
    nextSegmentTimecode: PropTypes.string,
};
