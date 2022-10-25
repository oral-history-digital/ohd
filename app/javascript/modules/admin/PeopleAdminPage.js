import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { usePersonApi } from 'modules/api';
import { getCurrentProject } from 'modules/data';
import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import {
    usePeople,
    useMutatePeople,
    useMutatePersonWithAssociations,
    useMutatePersonLandingPageMetadata,
    PersonForm
} from 'modules/person';
import DataContainer from './DataContainer';
import AddButton from './AddButton';

export default function PeopleAdminPage() {
    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const { data: peopleData, isLoading, isValidating } = usePeople();
    const mutatePeople = useMutatePeople();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata = useMutatePersonLandingPageMetadata();
    const { deletePerson } = usePersonApi();

    const scope = 'person';
    const hideAdd = false, hideEdit = false, hideDelete = false;
    const detailsAttributes = [
        'gender',
        'title',
        'first_name',
        'last_name',
        'birth_name',
        'alias_names',
        'other_first_names',
        'date_of_birth',
        'description'
    ];
    const outerScope = 'project';
    const outerScopeId = project.id;
    const interview = undefined;
    const joinedData = {};
    const showComponent = undefined;

    if (isLoading) {
        return (
            <div className='wrapper-content register'>
                <Spinner />
            </div>
        );
    }

    if (!peopleData) {
        return null;
    }

    function renderForm(data, onSubmit, onCancel) {
        return (
            <PersonForm
                data={data}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    }

    async function handleDeletePerson(id, callback) {
        mutatePeople(async people => {
            await deletePerson(id);

            mutatePersonWithAssociations(id);
            mutatePersonLandingPageMetadata(id);

            const updatedPeople = {
                ...people,
                data: { ...people.data }
            };
            delete updatedPeople.data[id];

            return updatedPeople;
        });

        if (typeof callback === 'function') {
            callback();
        }
    }

    const sortedData = Object.values(peopleData)
        .sort((a, b) => {
            const aName = a.name[locale];
            const bName = b.name[locale];
            return aName.localeCompare(bName, locale);
        });

    return (
        <div className='wrapper-content register'>
            <Helmet>
                <title>
                    {t(`activerecord.models.${scope}.other`)}
                </title>
            </Helmet>

            <AuthShowContainer ifLoggedIn>
                <h1 className="registry-entries-title">
                    {t(`activerecord.models.${scope}.other`)}
                </h1>

                <div className={classNames('LoadingOverlay', {
                    'is-loading': isValidating
                })}>
                    {!hideAdd && (
                        <AddButton
                            scope={scope}
                            interview={interview}
                            onClose={closeModal => renderForm(undefined, closeModal, closeModal)}
                            disabled={isValidating}
                        />
                    )}

                    {sortedData.map(data => (
                        <DataContainer
                            data={data}
                            scope={scope}
                            outerScope={outerScope}
                            outerScopeId={outerScopeId}
                            detailsAttributes={detailsAttributes}
                            joinedData={joinedData}
                            form={renderForm}
                            showComponent={showComponent}
                            hideEdit={hideEdit}
                            hideDelete={hideDelete}
                            handleDelete={handleDeletePerson}
                            disabled={isValidating}
                            key={`${scope}-${data.id}`}
                        />
                    ))}

                    {!hideAdd && (
                        <AddButton
                            scope={scope}
                            interview={interview}
                            onClose={closeModal => renderForm(undefined, closeModal, closeModal)}
                            disabled={isValidating}
                        />
                    )}
                </div>

            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
