import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

import { Form, validateTapeNumber } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

const CONTRIBUTION_TYPES_SPEAKING = [
    'interviewee',
    'interviewer',
    'cinematographer',
    'sound',
    'producer',
    'other_attender',
];

export default function UploadEditTable({
    locale,
    projectId,
    project,
    archiveId,
    interview,
    languages,
    submitData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [showForm, setShowForm] = useState(true);

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
            <p>
                <a href={`${pathBase}/edit-table-import-template.csv?id=${archiveId}&locale=${locale}`} download>
                    <span className="flyout-sub-tabs-content-ico-link">
                        <FaDownload className="Icon Icon--small" title={t('download')} />
                        {' '}
                        {t('edit.upload_edit_table.template')}
                    </span>
                </a>
            </p>

            <Form
                scope='edit_table'
                onSubmit={(params) => {
                    submitData({ locale, projectId, project }, params);
                    setShowForm(false);
                }}
                submitText='edit.upload_edit_table.title'
                values={{
                    archive_id: archiveId,
                }}
                elements={[
                    {
                        attribute: 'data',
                        elementType: 'input',
                        type: 'file',
                        validate: function(v){return v instanceof File},
                    },
                    {
                        elementType: 'input',
                        help: 'import_edit_table.only_references',
                        attribute: 'only_references',
                        type: 'checkbox'
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

UploadEditTable.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
};
