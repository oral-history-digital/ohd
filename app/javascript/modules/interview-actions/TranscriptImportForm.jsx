import { useState } from 'react';

import { CONTRIBUTION_TYPES_SPEAKING } from 'modules/constants';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Button, InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import ImportValidationFeedback from './ImportValidationFeedback';
import {
    ACCEPTED_FORMATS,
    ODT_EXTENSION,
    SPREADSHEET_EXTENSIONS,
} from './constants';
import { useImportValidation } from './hooks';
import { getFileExtension, prepareTranscriptParams } from './utils';

const FRAME_RATE_OPTIONS = [24, 25, 30, 50, 60].map((rate) => ({
    value: String(rate),
    name: `${rate} fps`,
}));

/**
 * Checks transcript settings before queueing an import and reports request failures.
 * @param {Object} props - Record data, form options, and mutation callbacks.
 * @returns {React.ReactElement|null} Editing controls and request feedback.
 */
export default function TranscriptImportForm({
    archiveId,
    interview,
    languages,
    submitData,
    onCancel,
    template,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();
    const [filename, setFilename] = useState('');
    const [queued, setQueued] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const validation = useImportValidation(
        pathBase,
        'transcripts',
        prepareTranscriptParams
    );
    const [useFrameTimecodes, setUseFrameTimecodes] = useState(false);
    const extension = getFileExtension(filename);
    const isOdt = extension === ODT_EXTENSION;
    const isSpreadsheet = SPREADSHEET_EXTENSIONS.includes(extension);

    const handleFileChange = (name, file) => {
        if (name === 'data') setFilename(file?.name || '');
    };

    if (!interview.contributions) {
        return null;
    }

    if (queued) {
        return (
            <>
                <InlineNotification
                    variant="success"
                    title={t('import_validation.queued')}
                    description={t('import_validation.queued_hint')}
                    role="status"
                    isClosable={false}
                />
                <div className="u-align-right">
                    <Button buttonText={t('close')} onClick={onCancel} />
                </div>
            </>
        );
    }

    const tapeNumbers = interview.tape_numbers;
    if (!Array.isArray(tapeNumbers) || tapeNumbers.length === 0) {
        return (
            <>
                {template}
                <InlineNotification
                    variant={Array.isArray(tapeNumbers) ? 'error' : 'info'}
                    title={t(
                        Array.isArray(tapeNumbers)
                            ? 'transcript_import.no_tapes'
                            : 'transcript_import.loading_tapes'
                    )}
                    role={Array.isArray(tapeNumbers) ? 'alert' : 'status'}
                    isClosable={false}
                />
                <div className="u-align-right">
                    <Button buttonText={t('close')} onClick={onCancel} />
                </div>
            </>
        );
    }

    const handleSubmit = async (params) => {
        if (submitting || validation.status === 'checking') return;
        setSubmitError(false);
        if (!(await validation.check(params.transcript))) {
            throw new Error('Import pre-check did not pass');
        }
        setSubmitting(true);
        return new Promise((resolve, reject) => {
            submitData(
                { pathBase },
                prepareTranscriptParams(params.transcript),
                {
                    onError: () => {
                        setSubmitting(false);
                        setSubmitError(true);
                        reject(new Error('Import request failed'));
                    },
                },
                () => {
                    setSubmitting(false);
                    setQueued(true);
                    resolve();
                }
            );
        });
    };

    // Create a copy in order to not mutate state in the form.
    const contributions = Object.values(interview.contributions)
        .filter((contribution) =>
            CONTRIBUTION_TYPES_SPEAKING.includes(contribution.contribution_type)
        )
        .map((contribution) => ({
            id: contribution.id,
            person_id: contribution.person_id,
            speaker_designation: contribution.speaker_designation,
        }));

    const assignedLanguageIds = [
        interview.primary_language_id,
        interview.secondary_language_id,
        interview.primary_translation_language_id,
        interview.secondary_translation_language_id,
    ]
        .filter((id) => id != null)
        .map(String);
    const assignedLanguages = Object.fromEntries(
        Object.entries(languages).filter(([id]) =>
            assignedLanguageIds.includes(String(id))
        )
    );

    return (
        <>
            {template}
            <p className="explanation">{t('upload.explanation.transcript')}</p>

            <Form
                scope="transcript"
                onChange={() => {
                    validation.reset();
                    setSubmitError(false);
                }}
                fetching={submitting || validation.status === 'checking'}
                onCancel={onCancel}
                onSubmit={handleSubmit}
                submitText="edit.upload_transcript.title"
                values={{
                    archive_id: archiveId,
                    tape_number:
                        tapeNumbers.length === 1 ? String(tapeNumbers[0]) : '',
                    contributions_attributes: contributions,
                }}
                elements={[
                    {
                        attribute: 'data',
                        elementType: 'input',
                        type: 'file',
                        accept: ACCEPTED_FORMATS,
                        validate: function (v) {
                            return v instanceof File;
                        },
                        handlechangecallback: handleFileChange,
                    },
                    {
                        elementType: 'select',
                        attribute: 'transcript_language_id',
                        values: assignedLanguages,
                        withEmpty: true,
                        validate: function (v) {
                            return v !== '';
                        },
                    },
                    {
                        attribute: 'tape_number',
                        elementType: 'select',
                        values: tapeNumbers.map((number) => ({
                            value: String(number),
                            name: `${t('tape')} ${number}`,
                        })),
                        withEmpty: tapeNumbers.length > 1,
                        keepOrder: true,
                        labelKey: isOdt
                            ? 'transcript_import.starting_tape'
                            : undefined,
                        help: isOdt
                            ? 'transcript_import.starting_tape_help'
                            : undefined,
                        validate: (value) =>
                            tapeNumbers.some(
                                (number) => String(number) === String(value)
                            ),
                    },
                    {
                        attribute: 'use_frame_timecodes',
                        elementType: 'input',
                        type: 'checkbox',
                        hidden: !isSpreadsheet,
                        help: 'activerecord.attributes.transcript.timecode_frame_rate_explanation',
                        handlechangecallback: (_name, checked) =>
                            setUseFrameTimecodes(checked),
                    },
                    {
                        attribute: 'timecode_frame_rate',
                        elementType: 'select',
                        values: FRAME_RATE_OPTIONS,
                        withEmpty: true,
                        keepOrder: true,
                        validate: Boolean,
                        hidden: !isSpreadsheet || !useFrameTimecodes,
                    },
                    {
                        elementType: 'input',
                        help: 'activerecord.attributes.transcript.delete_existing_explanation',
                        attribute: 'delete_existing',
                        type: 'checkbox',
                    },
                    {
                        elementType: 'input',
                        help: 'activerecord.attributes.transcript.update_only_speakers_explanation',
                        attribute: 'update_only_speakers',
                        type: 'checkbox',
                    },
                    {
                        attribute: 'tape_durations',
                        help: 'activerecord.attributes.transcript.tape_durations_explanation',
                        hidden: !isOdt,
                        validate: function (v) {
                            return Boolean(v?.trim());
                        },
                    },
                    {
                        attribute: 'time_shifts',
                        help: 'activerecord.attributes.transcript.time_shifts_explanation',
                        hidden: !isOdt,
                    },
                    {
                        elementType: 'speakerDesignationInputs',
                        attribute: 'contributions_attributes',
                        value: contributions,
                    },
                ]}
            >
                <ImportValidationFeedback {...validation} />
                {submitError && (
                    <InlineNotification
                        variant="error"
                        title={t('import_validation.import_failed')}
                        isClosable={false}
                    />
                )}
            </Form>
        </>
    );
}

TranscriptImportForm.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    template: PropTypes.node,
};
