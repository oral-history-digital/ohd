import { useState} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { submitDataWithFetch } from 'modules/api';
import { getCurrentProject } from 'modules/data';
import { Form } from 'modules/forms';
import { useEventTypes } from 'modules/event-types';
import { EventForm, Event } from 'modules/events';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import {
    PERSON_GENDER_MALE,
    PERSON_GENDER_FEMALE,
    PERSON_GENDER_DIVERSE,
    PERSON_GENDER_NOT_SPECIFIED,
    PERSON_TITLE_DOCTOR,
    PERSON_TITLE_PROFESSOR,
    PERSON_TITLE_PROFESSOR_WITH_PROMOTION,
} from './constants';
import useMutatePeople from './useMutatePeople';
import useMutatePersonWithAssociations from './useMutatePersonWithAssociations';
import useMutatePersonLandingPageMetadata from './useMutatePersonLandingPageMetadata';

const formElements = [
    {
        elementType: 'select',
        attribute: 'gender',
        values: [
            PERSON_GENDER_MALE,
            PERSON_GENDER_FEMALE,
            PERSON_GENDER_DIVERSE,
            PERSON_GENDER_NOT_SPECIFIED
        ],
        optionsScope: 'gender',
        withEmpty: true,
    },
    {
        elementType: 'select',
        attribute: 'title',
        values: [
            PERSON_TITLE_DOCTOR,
            PERSON_TITLE_PROFESSOR,
            PERSON_TITLE_PROFESSOR_WITH_PROMOTION
        ],
        optionsScope: 'title',
        withEmpty: true,
    },
    {
        attribute: 'first_name',
        multiLocale: true,
    },
    {
        attribute: 'last_name',
        multiLocale: true,
    },
    {
        attribute: 'birth_name',
        multiLocale: true,
    },
    {
        attribute: 'alias_names',
        multiLocale: true,
    },
    {
        attribute: 'other_first_names',
        multiLocale: true,
    },
    {
        attribute: 'pseudonym_first_name',
        multiLocale: true,
    },
    {
        attribute: 'pseudonym_last_name',
        multiLocale: true,
    },
    {
        attribute: 'use_pseudonym',
        elementType: 'input',
        type: 'checkbox',
    },
    {
        attribute: 'date_of_birth',
    },
    {
        elementType: 'textarea',
        attribute: 'description',
        multiLocale: true,
    },
];

export default function PersonForm({
    data: person,
    onSubmit,
    onCancel
}) {
    const [isFetching, setIsFetching] = useState(false);
    const { data: eventTypes, isLoading: eventTypesAreLoading } = useEventTypes();
    const mutatePeople = useMutatePeople();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata = useMutatePersonLandingPageMetadata();
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);

    function showEvent(event) {
        return <Event event={event} />;
    }

    if (eventTypesAreLoading) {
        return <Spinner />;
    }

    const nestedScopeProps = (eventTypes?.length > 0) ?
        [{
            formComponent: EventForm,
            formProps: { personId: person?.id },
            parent: person,
            scope: 'event',
            elementRepresentation: showEvent,
            onDeleteCallback: (id) => {
                // In case of server error.
                if (typeof id !== 'number') {
                    return;
                }

                mutatePeople(async people => {
                    const eventHolder = people.data[person.id];

                    const updatedPeople = {
                        ...people,
                        data: {
                            ...people.data,
                            [person.id]: {
                                ...eventHolder,
                                events: eventHolder.events.filter(event => event.id !== id)
                            }
                        }
                    };
                    delete updatedPeople.data[id];

                    return updatedPeople;
                });
            }
        }] :
        undefined;

    return (
        <div>
            {person && (
                <h3 className="u-mt-none u-mb">
                    {person.display_name}
                </h3>
            )}

            <Form
                data={person}
                values={{ project_id: project.id }}
                scope="person"
                nestedScopeProps={nestedScopeProps}
                helpTextCode="person_form"
                onSubmit={async (params) => {
                    mutatePeople(async people => {
                        const id = params.person.id;
                        setIsFetching(true);
                        const result = await submitDataWithFetch(pathBase, params);
                        const updatedPerson = result.data;

                        // Other stuff that needs to be done after result is returned.
                        setIsFetching(false);
                        if (id) {
                            mutatePersonWithAssociations(id);
                            mutatePersonLandingPageMetadata(id);
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        const updatedPeople = {
                            ...people,
                            data: {
                                ...people.data,
                                [updatedPerson.id]: updatedPerson
                            }
                        };
                        return updatedPeople;
                    });
                }}
                onCancel={onCancel}
                submitText="submit"
                elements={formElements}
                fetching={isFetching}
            />
        </div>
    );
}

PersonForm.propTypes = {
    data: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
