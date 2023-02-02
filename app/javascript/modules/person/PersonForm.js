import { useState} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { submitDataWithFetch } from 'modules/api';
import { useI18n } from 'modules/i18n';
import { getCurrentProject } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import {
    PERSON_GENDER_MALE,
    PERSON_GENDER_FEMALE,
    PERSON_GENDER_DIVERSE,
    PERSON_TITLE_DOCTOR,
    PERSON_TITLE_PROFESSOR,
    PERSON_TITLE_PROFESSOR_WITH_PROMOTION,
} from './constants';
import useMutatePeople from './useMutatePeople';
import useMutatePersonWithAssociations from './useMutatePersonWithAssociations';
import useMutatePersonLandingPageMetadata from './useMutatePersonLandingPageMetadata';
import formatPersonName from './formatPersonName';

const formElements = [
    {
        elementType: 'select',
        attribute: 'gender',
        values: [
            PERSON_GENDER_MALE,
            PERSON_GENDER_FEMALE,
            PERSON_GENDER_DIVERSE
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
        attribute: 'date_of_birth',
    },
    {
        elementType: 'textarea',
        attribute: 'description',
        multiLocale: true,
    },
];

export default function PersonForm({
    data,
    onSubmit,
    onCancel
}) {
    const [isFetching, setIsFetching] = useState(false);
    const mutatePeople = useMutatePeople();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata = useMutatePersonLandingPageMetadata();
    const pathBase = usePathBase();
    const { locale, translations } = useI18n();
    const project = useSelector(getCurrentProject);

    return (
        <div>
            {data && (
                <h3 className="u-mt-none u-mb">
                    {formatPersonName(data, translations, { locale })}
                </h3>
            )}

            <Form
                data={data}
                values={{ project_id: project.id }}
                scope="person"
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
