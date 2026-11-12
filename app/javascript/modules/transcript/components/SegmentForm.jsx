import { useCallback, useState } from 'react';

import { Form } from 'modules/forms';
import {
    validateTimecode,
    validateTimecodeInRange,
} from 'modules/forms/utils/validators';
import { useI18n } from 'modules/i18n';
import { useInterviewContributors } from 'modules/person';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import { useSegmentSaveNotification } from '../hooks';
import { getTimecodeHelpText } from '../utils';

/**
 * Edits interview content through the current project and locale route.
 * @param {Object} props - Content data and form/mutation callbacks.
 * @returns {React.ReactElement|null} Content editor and processing feedback.
 */
export default function SegmentForm({
    contentLocale,
    segment,
    submitData,
    onSubmit,
    onCancel,
    onChange,
    prevSegmentTimecode,
    nextSegmentTimecode,
}) {
    const pathBase = usePathBase();
    const interviewId = segment?.interview_id;
    const { data: people, isLoading } = useInterviewContributors(interviewId);
    const { t } = useI18n();
    const {
        isSaving,
        saveNotification,
        handleSaveStart,
        handleSaveError,
        dismissSaveNotification,
    } = useSegmentSaveNotification(segment?.id);

    const [timecodeError, setTimecodeError] = useState(null);

    const isTimecodeValid = useCallback(
        (value) =>
            value === segment?.timecode ||
            validateTimecodeInRange(
                value,
                prevSegmentTimecode,
                nextSegmentTimecode
            ),
        [segment?.timecode, prevSegmentTimecode, nextSegmentTimecode]
    );

    const handleFormChange = useCallback(
        (changeInfo) => {
            const { field, value } = changeInfo;
            if (field === 'timecode') {
                let error = null;
                if (!isTimecodeValid(value)) {
                    error = validateTimecode(value)
                        ? 'invalid_timecode_range'
                        : 'invalid_format';
                }
                setTimecodeError(error);
            }
            onChange?.(changeInfo);
        },
        [isTimecodeValid, onChange]
    );

    /**
     * Waits for the server before the form marks the submitted values as saved.
     *
     * @param {Object} params - Segment form payload
     * @returns {Promise<Object>} Successful save response
     */
    const submitHandler = (params) => {
        handleSaveStart();
        return new Promise((resolve, reject) => {
            submitData({ pathBase }, params, resolve, {
                onError: (error) => {
                    handleSaveError(error);
                    reject(error);
                },
            });
        });
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
                nextSegmentTimecode
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
                onSubmitCallback={onSubmit}
                onCancel={onCancel}
                onChange={handleFormChange}
                fetching={isSaving}
                hasValidationErrors={Boolean(timecodeError)}
                disableIfUnchanged={true}
                notification={saveNotification}
                onDismissNotification={dismissSaveNotification}
                data={segment}
                values={{
                    id: segment?.id,
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
    contentLocale: PropTypes.string.isRequired,
    segment: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    prevSegmentTimecode: PropTypes.string,
    nextSegmentTimecode: PropTypes.string,
};
