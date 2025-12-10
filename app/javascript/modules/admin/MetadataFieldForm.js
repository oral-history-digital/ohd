import { useState } from 'react';

import {
    METADATA_SOURCE_EVENT_TYPE,
    METADATA_SOURCE_INTERVIEW,
    METADATA_SOURCE_PERSON,
    METADATA_SOURCE_REGISTRY_REFERENCE_TYPE,
} from 'modules/constants';
import {
    Fetch,
    getRegistryReferenceTypesForCurrentProjectFetched,
} from 'modules/data';
import { useEventTypes } from 'modules/event-types';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import useCombinedRegistryReferenceTypes from './useCombinedRegistryReferenceTypes';

const NAME_VALUES = {
    Interview: [
        'media_type',
        'media_missing',
        'archive_id',
        'interview_date',
        'duration',
        'tape_count',
        'language_id',
        'primary_language_id',
        'secondary_language_id',
        'primary_translation_language_id',
        'secondary_translation_language_id',
        'observations',
        'workflow_state',
        'tasks_user_ids',
        'tasks_supervisor_ids',
        'description',
        'collection_id',
        'signature_original',
        'startpage_position',
        'project_id',
        'project_access',
        'transcript_coupled',
        'pseudo_links',
        'publication_date',
    ],
    Person: [
        'date_of_birth',
        'year_of_birth',
        'gender',
        'description_interviewee',
        'birth_name',
        'other_first_names',
        'alias_names',
        'pseudonym_or_name',
    ],
};

export default function MetadataFieldForm({
    data,
    submitData,
    onSubmit,
    onCancel,
}) {
    const { locale } = useI18n();
    const { project, projectId } = useProject();
    const [source, setSource] = useState(data?.source);
    const [registryReferenceTypeId, setRegistryReferenceTypeId] = useState(
        data?.registry_reference_type_id
    );
    const [eventTypeId, setEventTypeId] = useState(data?.event_type_id);

    const { isLoading: eventTypesLoading, data: eventTypes } = useEventTypes();
    const { isLoading: registryReferenceTypesLoading, registryReferenceTypes } =
        useCombinedRegistryReferenceTypes();

    const handleSourceChange = (name, value) => {
        setSource(value);
    };

    const handleRegistryReferenceTypeIdChange = (name, value) => {
        setRegistryReferenceTypeId(value);
    };

    const handleEventTypeIdChange = (name, value) => {
        setEventTypeId(value);
    };

    if (eventTypesLoading || registryReferenceTypesLoading) {
        return <Spinner />;
    }

    const isRegistrySource = source === METADATA_SOURCE_REGISTRY_REFERENCE_TYPE;
    const isEventSource = source === METADATA_SOURCE_EVENT_TYPE;

    const nameValuesForSource = () => {
        if (source === METADATA_SOURCE_REGISTRY_REFERENCE_TYPE) {
            return (
                registryReferenceTypes &&
                registryReferenceTypes[registryReferenceTypeId]?.code
            );
        } else if (isEventSource) {
            return eventTypes.find((et) => et.id === eventTypeId)?.code;
        } else {
            return NAME_VALUES[source];
        }
    };

    return (
        <Fetch
            fetchParams={[
                'registry_reference_types',
                null,
                null,
                `for_projects=${project?.id}`,
            ]}
            testSelector={getRegistryReferenceTypesForCurrentProjectFetched}
            alwaysRenderChildren
        >
            <Form
                scope="metadata_field"
                onSubmit={(params) => {
                    submitData({ locale, projectId, project }, params);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                helpTextCode="metadata_form"
                data={data}
                values={{ project_id: project.id }}
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'source',
                        values: [
                            METADATA_SOURCE_INTERVIEW,
                            METADATA_SOURCE_PERSON,
                            METADATA_SOURCE_REGISTRY_REFERENCE_TYPE,
                            METADATA_SOURCE_EVENT_TYPE,
                        ],
                        optionsScope: 'activerecord.attributes.metadata_field',
                        withEmpty: true,
                        handlechangecallback: handleSourceChange,
                    },
                    {
                        elementType: 'select',
                        attribute: 'registry_reference_type_id',
                        values: registryReferenceTypes,
                        withEmpty: true,
                        handlechangecallback:
                            handleRegistryReferenceTypeIdChange,
                        hidden: !isRegistrySource,
                        help: 'help_texts.metadata_fields.registry_reference_type_id',
                        validate: function (v) {
                            return /\d+/.test(v);
                        },
                    },
                    {
                        elementType: 'select',
                        attribute: 'ref_object_type',
                        values: ['Interview', 'Person'],
                        optionsScope: 'activerecord.attributes.metadata_field',
                        withEmpty: true,
                        hidden: !isRegistrySource,
                        help: 'help_texts.metadata_fields.ref_object_type',
                        validate: function (v) {
                            return /\w+/.test(v);
                        },
                    },
                    {
                        elementType: 'select',
                        attribute: 'event_type_id',
                        values: eventTypes,
                        withEmpty: true,
                        handlechangecallback: handleEventTypeIdChange,
                        hidden: !isEventSource,
                        help: 'help_texts.metadata_fields.event_type_id',
                        validate: (v) => /\d+/.test(v),
                    },
                    {
                        elementType: 'select',
                        attribute: 'eventable_type',
                        values: ['Person'],
                        optionsScope: 'activerecord.attributes.metadata_field',
                        withEmpty: true,
                        hidden: !isEventSource,
                        help: 'help_texts.metadata_fields.eventable_type',
                        validate: (v) => /\w+/.test(v),
                    },
                    {
                        elementType: 'select',
                        attribute: 'name',
                        values: nameValuesForSource(),
                        optionsScope: 'search_facets',
                        withEmpty: true,
                        hidden: isRegistrySource || isEventSource,
                        validate: function (v) {
                            return /\w+/.test(v);
                        },
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
                        hidden: !isRegistrySource,
                    },
                    {
                        elementType: 'colorPicker',
                        attribute: 'map_color',
                        hidden: !isRegistrySource,
                    },
                    {
                        elementType: 'input',
                        attribute: 'display_on_landing_page',
                        type: 'checkbox',
                    },
                    {
                        elementType: 'input',
                        attribute: 'use_in_metadata_import',
                        type: 'checkbox',
                        hidden: !isRegistrySource,
                    },
                ]}
            />
        </Fetch>
    );
}

MetadataFieldForm.propTypes = {
    data: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
