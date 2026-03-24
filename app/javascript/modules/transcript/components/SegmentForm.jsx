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

import { useSegmentSaveNotification } from '../hooks';
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
    const {
        isSaving,
        saveNotification,
        handleSaveStart,
        dismissSaveNotification,
    } = useSegmentSaveNotification(segment?.id);

    // Detect timecode format from the interview data so ms and frames are not mixed
    const timecodeFormat = detectTimecodeFormat(
        segment?.timecode || prevSegmentTimecode || nextSegmentTimecode
    );

    const [timecodeError, setTimecodeError] = useState(
        'invalid_timecode_range'
    );
    const [hasTimecodeError, setHasTimecodeError] = useState(false);
    const [hasSpeakerError, setHasSpeakerError] = useState(false);
    // Pure validators — no setState, safe to call during render
    const isSpeakerValid = useCallback((value) => {
        return value !== null && value !== undefined && value !== '';
    }, []);

    const isTimecodeValid = useCallback(
        (value) => {
            if (!validateTimecode(value, timecodeFormat)) return false;
            return validateTimecodeInRange(
                value,
                prevSegmentTimecode,
                nextSegmentTimecode,
                timecodeFormat
            );
        },
        [prevSegmentTimecode, nextSegmentTimecode, timecodeFormat]
    );

    // Handle form field changes — update error state here instead of inside validators
    const handleFormChange = useCallback(
        (changeInfo) => {
            const { field, value } = changeInfo;
            if (field === 'timecode') {
                if (!validateTimecode(value, timecodeFormat)) {
                    setTimecodeError(
                        timecodeFormat === 'frames'
                            ? 'invalid_format_frames'
                            : 'invalid_format'
                    );
                    setHasTimecodeError(true);
                } else if (
                    !validateTimecodeInRange(
                        value,
                        prevSegmentTimecode,
                        nextSegmentTimecode,
                        timecodeFormat
                    )
                ) {
                    setTimecodeError('invalid_timecode_range');
                    setHasTimecodeError(true);
                } else {
                    setHasTimecodeError(false);
                }
            } else if (field === 'speaker_id') {
                setHasSpeakerError(!isSpeakerValid(value));
            }
            if (typeof onChange === 'function') {
                onChange(changeInfo);
            }
        },
        [
            timecodeFormat,
            prevSegmentTimecode,
            nextSegmentTimecode,
            isSpeakerValid,
            onChange,
        ]
    );

    const submitHandler = (params) => {
        handleSaveStart(); // Set saving state and clear notifications before dispatching save action
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
            validate: isSpeakerValid,
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
            validate: isTimecodeValid,
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
                onChange={handleFormChange}
                fetching={isSaving}
                hasValidationErrors={hasTimecodeError || hasSpeakerError}
                disableIfUnchanged={true}
                notification={saveNotification}
                onDismissNotification={dismissSaveNotification}
                data={segment}
                values={{
                    locale: contentLocale,
                    speaker_id: segment?.speaker_id,
                    timecode: segment?.timecode || '',
                }}
                submitText="save"
                cancelText="close"
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
