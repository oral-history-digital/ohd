import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Form from '../containers/form/Form';
import InterviewContributorsContainer from '../containers/InterviewContributorsContainer';
import { useI18n } from '../hooks/i18n';
import { validateTapeNumber } from 'utils/validators';

export default function UploadTranscript({
    locale,
    projectId,
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

    if (!showForm) {
        return (
            <>
                <p>
                    {t('edit.upload.processing')}
                </p>
                <button type="button" className='return-to-upload' onClick={() => setShowForm(true)}>
                    {t('edit.upload.return')}
                </button>
            </>
        );
    }

    return (
        <>
            <p className='explanation'>
                {t('upload.explanation.transcript')}
            </p>

            <p>
                <a href="/transcript-import-template.ods" download>
                    <span className="flyout-sub-tabs-content-ico-link">
                    <i className="fa fa-download flyout-content-ico" title={t('download')}></i>
                    {t('transcript_template')}
                    </span>
                </a>
            </p>

            <Form
                scope='transcript'
                onSubmit={(params) => {
                    submitData({ locale, projectId }, params);
                    setShowForm(false);
                }}
                submitText='edit.upload_transcript.title'
                values={{
                    archive_id: archiveId,
                    contributions_attributes: interview && interview.contributions
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
                        hidden: isOdt,
                        validate: validateTapeNumber,
                    },
                    {
                        elementType: 'input',
                        help: 'activerecord.attributes.transcript.delete_existing_explanation',
                        attribute: 'delete_existing',
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
                ]}
            >
                <InterviewContributorsContainer withSpeakerDesignation onlySpeakingContributors />
            </Form>
        </>
    );
}

UploadTranscript.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
};
