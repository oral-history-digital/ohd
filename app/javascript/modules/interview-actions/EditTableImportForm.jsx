import { CONTRIBUTION_TYPES_SPEAKING } from 'modules/constants';
import PropTypes from 'prop-types';

import ImportForm from './ImportForm';

/**
 * Configures CSV edit-table imports using the shared validation and queue flow.
 * @param {Object} props - Interview data, template, and mutation/modal callbacks.
 * @returns {React.ReactElement} Edit-table import controls and feedback.
 */
export default function EditTableImportForm({
    archiveId,
    interview,
    submitData,
    onCancel,
    template,
}) {
    const contributions = Object.values(interview.contributions)
        .filter((contribution) =>
            CONTRIBUTION_TYPES_SPEAKING.includes(contribution.contribution_type)
        )
        .map((contribution) => ({
            id: contribution.id,
            person_id: contribution.person_id,
            speaker_designation: contribution.speaker_designation,
        }));

    return (
        <ImportForm
            scope="edit_table"
            resource="edit_tables"
            submitData={submitData}
            onCancel={onCancel}
            template={template}
            submitText="edit.upload_edit_table.title"
            labelPosition="above"
            values={{
                archive_id: archiveId,
                contributions_attributes: contributions,
            }}
            elements={[
                {
                    attribute: 'data',
                    elementType: 'input',
                    type: 'file',
                    accept: '.csv',
                    validate: (value) => value instanceof File,
                },
                {
                    elementType: 'switch',
                    help: 'import_edit_table.only_references',
                    attribute: 'only_references',
                },
                {
                    elementType: 'speakerDesignationInputs',
                    attribute: 'contributions_attributes',
                    value: contributions,
                },
            ]}
        />
    );
}

EditTableImportForm.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    template: PropTypes.node,
};
