import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';

const NAME_VALUES = {
    Interview: [
        "media_type", "archive_id", "interview_date", "duration", "tape_count",
        "language_id", "observations", "workflow_state", "tasks_user_account_ids",
        "tasks_supervisor_ids", "description", "collection_id"
    ],
    Person: [
        "date_of_birth", "year_of_birth", "gender"
    ],
}

export default function MetadataFieldForm({
    locale,
    projectId,
    projects,
    project,
    registryReferenceTypes,
    data,
    submitData,
    closeArchivePopup,
}) {
    const { t } = useI18n();
    const [source, setSource] = useState(data?.source);
    const [registryReferenceTypeId, setRegistryReferenceTypeId] = useState(data?.registry_reference_type_id);

    const handleSourceChange = (name, value) => {
        setSource(value);
    };

    const handleRegistryReferenceTypeIdChange = (name, value) => {
        setRegistryReferenceTypeId(value);
    };

    const nameValuesForSource = () => {
        if (source === 'RegistryReferenceType') {
            return registryReferenceTypes[registryReferenceTypeId]?.code;
        } else {
            return NAME_VALUES[source];
        }
    };

    return (
        <Form
            scope='metadata_field'
            onSubmit={(params) => {
                submitData({ locale, projectId, projects }, params);
                closeArchivePopup()
            }}
            data={data}
            values={{
                project_id: project.id
            }}
            elements={[
                {
                    elementType: 'select',
                    attribute: 'source',
                    values: ['Interview', 'Person', 'RegistryReferenceType'],
                    optionsScope: 'activerecord.attributes.metadata_field',
                    withEmpty: true,
                    handlechangecallback: handleSourceChange,
                },
                {
                    elementType: 'select',
                    attribute: 'registry_reference_type_id',
                    values: registryReferenceTypes,
                    withEmpty: true,
                    handlechangecallback: handleRegistryReferenceTypeIdChange,
                    hidden: source !== 'RegistryReferenceType',
                    help: 'help_texts.metadata_fields.registry_reference_type_id',
                },
                {
                    elementType: 'select',
                    attribute: 'ref_object_type',
                    values: ['Interview', 'Person'],
                    optionsScope: 'activerecord.attributes.metadata_field',
                    withEmpty: true,
                    hidden: source !== 'RegistryReferenceType',
                    help: 'help_texts.metadata_fields.ref_object_type',
                },
                {
                    elementType: 'select',
                    attribute: 'name',
                    values: nameValuesForSource(),
                    optionsScope: 'search_facets',
                    withEmpty: true,
                    hidden: source === 'RegistryReferenceType',
                },
                {
                    attribute: 'label',
                    multiLocale: true,
                },
                {
                    elementType: 'input',
                    attribute: 'use_as_facet',
                    type: 'checkbox',
                },
                {
                    elementType: 'input',
                    attribute: 'facet_order',
                    validate: function(v){return /\d+\.*\d*/.test(v)}
                },
                {
                    elementType: 'input',
                    attribute: 'use_in_results_table',
                    type: 'checkbox',
                },
                {
                    elementType: 'input',
                    attribute: 'use_in_results_list',
                    type: 'checkbox',
                },
                {
                    elementType: 'input',
                    attribute: 'list_columns_order',
                    validate: function(v){return /\d+\.*\d*/.test(v)}
                },
                {
                    elementType: 'input',
                    attribute: 'use_in_details_view',
                    type: 'checkbox',
                },
                {
                    elementType: 'input',
                    attribute: 'use_in_map_search',
                    type: 'checkbox',
                },
                {
                    elementType: 'input',
                    attribute: 'display_on_landing_page',
                    type: 'checkbox',
                },
            ]}
        />
    );
}

MetadataFieldForm.propTypes = {
    projects: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    registryReferenceTypes: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
};
