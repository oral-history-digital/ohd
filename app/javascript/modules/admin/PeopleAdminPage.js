import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { useEventTypes } from 'modules/event-types';
import { hideSidebar } from 'modules/sidebar';
import { ErrorMessage } from 'modules/ui';
import {
    usePeople,
    PersonTable,
    PersonForm
} from 'modules/person';
import EditViewOrRedirect from './EditViewOrRedirect';
import AddButton from './AddButton';

export default function PeopleAdminPage() {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const { isLoading: eventTypesAreLoading } = useEventTypes();
    const { isLoading: peopleAreLoading, data: people, error } = usePeople();

    useEffect(() => {
        dispatch(hideSidebar());
    }, []);

    if (!people || eventTypesAreLoading) {
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

    const peopleCount = typeof people === 'undefined' ?
        undefined :
        Object.values(people).length;

    return (
        <EditViewOrRedirect>
            <div className='wrapper-content register'>
                <Helmet>
                    <title>
                        {t('activerecord.models.person.other')}
                    </title>
                </Helmet>

                <AuthShowContainer ifLoggedIn>
                    <h1 className="registry-entries-title">
                        {peopleCount} {t('activerecord.models.person.other')}
                    </h1>

                    {peopleAreLoading ?
                        <Spinner /> : (
                        error ?
                            <ErrorMessage>{error.message}</ErrorMessage> : (
                            <>
                                <AddButton
                                    className="u-mb"
                                    scope="person"
                                    interview={undefined}
                                    onClose={closeModal => renderForm(undefined, closeModal, closeModal)}
                                    disabled={peopleAreLoading}
                                />
                                <PersonTable />
                        </>
                        )
                    )}
                </AuthShowContainer>

                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
