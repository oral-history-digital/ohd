import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

import { Form, validateTapeNumber } from 'modules/forms';
import { useI18n } from 'modules/i18n';

const CONTRIBUTION_TYPES_SPEAKING = [
    'interviewee',
    'interviewer',
    'cinematographer',
    'sound',
    'producer',
    'other_attender',
];

export default function UploadTranscript({
    locale,
    projectId,
    project,
    archiveId,
    interview,
    languages,
    submitData,
}) {
    const { t } = useI18n();
    const [isOdt, setIsOdt] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const handleFileChange = (name, file) => {
        if (name === 'data' && file && /\.odt$/.test(file.name)) {
            setIsOdt(true);
        } else {
            setIsOdt(false);
        }
    };

    if (!interview.contributions) {
        return null;
    }

    if (!showForm) {
        return (
            <>
                <p>
                    {t('edit.upload.processing')}
                </p>
                <button
                    type="button"
                    className='Button return-to-upload'
                    onClick={() => setShowForm(true)}
                >
                    {t('edit.upload.return')}
                </button>
            </>
        );
    }

    // Create a copy in order to not mutate state in the form.
    const contributions = Object.values(interview.contributions)
        .filter(contribution => CONTRIBUTION_TYPES_SPEAKING.includes(contribution.contribution_type))
        .map(contribution => ({
            id: contribution.id,
            contribution_type: contribution.contribution_type,
            person_id: contribution.person_id,
            speaker_designation: contribution.speaker_designation,
        }));

    return (
        <>
            <p className='explanation'>
                {t('upload.explanation.transcript')}
            </p>

            <p>
                <a href="/transcript-import-template.csv" download>
                    <span className="flyout-sub-tabs-content-ico-link">
                        <FaDownload className="Icon Icon--small" title={t('download')} />
                        {' '}
                        {t('transcript_template')}
                    </span>
                </a>
            </p>

            <Form
                scope='transcript'
                onSubmit={(params) => {
                    submitData({ locale, projectId, project }, params);
                    setShowForm(false);
                }}
                submitText='edit.upload_transcript.title'
                values={{
                    archive_id: archiveId,
                    contributions_attributes: contributions,
                }}
                elements={[
                    {
                        attribute: 'data',
                        elementType: 'input',
                        type: 'file',
                        validate: function(v){return v instanceof File},
                        handlechangecallback: handleFileChange,
                    },
                    {
                        elementType: 'select',
                        attribute: 'transcript_language_id',
                        values: languages,
                        withEmpty: true,
                        validate: function(v){return v !== ''}
                    },
                    {
                        attribute: 'tape_number',
                        validate: validateTapeNumber,
                    },
                    {
                        elementType: 'input',
                        help: 'activerecord.attributes.transcript.delete_existing_explanation',
                        attribute: 'delete_existing',
                        type: 'checkbox'
                    },
                    {
                        elementType: 'input',
                        help: 'activerecord.attributes.transcript.update_only_speakers_explanation',
                        attribute: 'update_only_speakers',
                        type: 'checkbox'
                    },
                    {
                        attribute: 'tape_durations',
                        help: 'activerecord.attributes.transcript.tape_durations_explanation',
                        hidden: !isOdt,
                        validate: function(v){return /^[\d{2}:\d{2}:\d{2},*]{1,}$/.test(v)}
                    },
                    {
                        attribute: 'time_shifts',
                        help: 'activerecord.attributes.transcript.time_shifts_explanation',
                        hidden: !isOdt,
                        validate: function(v){return /^[\d{2}:\d{2}:\d{2},*]{1,}$/.test(v)}
                    },
                    {
                        elementType: 'speakerDesignationInputs',
                        attribute: 'contributions_attributes',
                        value: contributions,
                    },
                ]}
            />
        </>
    );
}

UploadTranscript.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
};
