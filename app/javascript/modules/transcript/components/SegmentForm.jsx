import { useCallback, useState } from 'react';

import { Form } from 'modules/forms';
import {
    validateTimecode,
    validateTimecodeInRange,
} from 'modules/forms/utils/validators';
import { useI18n } from 'modules/i18n';
import { useInterviewContributors } from 'modules/person';
import { Spinner } from 'modules/spinners';
import { detectTimecodeFormat } from 'modules/utils';
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

    // Detect timecode format from the interview data so ms and frames are not mixed
    const timecodeFormat = detectTimecodeFormat(
        segment?.timecode || prevSegmentTimecode || nextSegmentTimecode
    );

    const [timecodeError, setTimecodeError] = useState(
        'invalid_timecode_range'
    );
    const [hasTimecodeError, setHasTimecodeError] = useState(false);
    const [hasSpeakerError, setHasSpeakerError] = useState(false);

    const speakerValidationHandler = useCallback((value) => {
        const isValid = value !== null && value !== undefined && value !== '';
        setHasSpeakerError(!isValid);
        return isValid;
    }, []);

    const timecodeValidationHandler = useCallback(
        (value) => {
            if (!validateTimecode(value, timecodeFormat)) {
                setTimecodeError(
                    timecodeFormat === 'frames'
                        ? 'invalid_format_frames'
                        : 'invalid_format'
                );
                setHasTimecodeError(true);
                return false;
            }
            if (
                !validateTimecodeInRange(
                    value,
                    prevSegmentTimecode,
                    nextSegmentTimecode,
                    timecodeFormat
                )
            ) {
                setTimecodeError('invalid_timecode_range');
                setHasTimecodeError(true);
                return false;
            }
            setHasTimecodeError(false);
            return true;
        },
        [prevSegmentTimecode, nextSegmentTimecode, timecodeFormat]
    );

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
            labelKey: 'edit.segment.text',
        },
        {
            elementType: 'select',
            attribute: 'speaker_id',
            values: Object.values(people || {}),
            value: segment?.speaker_id,
            withEmpty: true,
            validate: speakerValidationHandler,
            individualErrorMsg: 'empty',
            touchOnInvalid: true,
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
            touchOnInvalid: true,
            labelKey: 'edit.segment.timecode',
            help: getTimecodeHelpText(
                t,
                prevSegmentTimecode,
                nextSegmentTimecode,
                timecodeFormat
            ),
        },
    ];

    return isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spinner />
        </div>
    ) : (
        <div>
            <Form
                scope="segment"
                onSubmit={submitHandler}
                onCancel={onCancel}
                onChange={onChange}
                hasValidationErrors={hasTimecodeError || hasSpeakerError}
                disableIfUnchanged={true}
                data={segment}
                values={{
                    locale: contentLocale,
                    speaker_id: segment?.speaker_id,
                    timecode: segment?.timecode || '',
                }}
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
