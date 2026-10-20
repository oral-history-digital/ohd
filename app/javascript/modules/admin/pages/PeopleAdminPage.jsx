import { useEffect } from 'react';

import { AuthShowContainer } from 'modules/auth';
import { useEventTypes } from 'modules/event-types';
import { useI18n } from 'modules/i18n';
import { PersonForm, PersonTable, usePeople } from 'modules/person';
import { hideSidebar } from 'modules/sidebar';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';

import { AddButton, EditViewOrRedirect } from '../components';

/**
 * Shows authorized people administration with visible loading and request errors.
 *
 * @returns {React.ReactElement} People controls, request status, or access feedback.
 */
export default function PeopleAdminPage() {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const { isLoading: eventTypesAreLoading, error: eventTypesError } =
        useEventTypes();
    const {
        isLoading: peopleAreLoading,
        data: people,
        error: peopleError,
    } = usePeople();
    const error = peopleError || eventTypesError;

    useEffect(() => {
        dispatch(hideSidebar());
    }, [dispatch]);

    function renderForm(data, onSubmit, onCancel) {
        return (
            <PersonForm data={data} onSubmit={onSubmit} onCancel={onCancel} />
        );
    }

    const peopleCount = people ? Object.values(people).length : undefined;

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t('activerecord.models.person.other')}</title>
                </Helmet>

                <AuthShowContainer hasProjectAccess>
                    <h1 className="Page-main-title">
                        {peopleCount} {t('activerecord.models.person.other')}
                    </h1>

                    {error ? (
                        <InlineNotification
                            variant="error"
                            title={t('error')}
                            description={error.message}
                            isClosable={false}
                        />
                    ) : peopleAreLoading || eventTypesAreLoading || !people ? (
                        <Spinner />
                    ) : (
                        <>
                            <AddButton
                                className="u-mb"
                                scope="person"
                                interview={undefined}
                                onClose={(closeModal) =>
                                    renderForm(
                                        undefined,
                                        closeModal,
                                        closeModal
                                    )
                                }
                                disabled={peopleAreLoading}
                            />
                            <PersonTable />
                        </>
                    )}
                </AuthShowContainer>

                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
