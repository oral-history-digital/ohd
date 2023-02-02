import { Helmet } from 'react-helmet';

import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import {
    usePeople,
    PersonTable,
    PersonForm
} from 'modules/person';
import AddButton from './AddButton';

export default function PeopleAdminPage() {
    const { t } = useI18n();
    const { isLoading, isValidating, data: people } = usePeople();

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

                {isLoading ?
                    <Spinner /> : (
                    <>
                        <AddButton
                            className="u-mb"
                            scope="person"
                            interview={undefined}
                            onClose={closeModal => renderForm(undefined, closeModal, closeModal)}
                            disabled={isLoading}
                        />
                        <PersonTable />
                    </>
                )}

            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
