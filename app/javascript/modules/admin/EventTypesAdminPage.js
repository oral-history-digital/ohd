import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { getCurrentProject } from 'modules/data';
import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { useEventTypes, EventTypeForm } from 'modules/event-types';
import DataContainer from './DataContainer';
import AddButton from './AddButton';

export default function EventTypesAdminPage() {
    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const { data, isLoading, isValidating } = useEventTypes();

    const scope = 'event_type';
    const hideAdd = false, hideEdit = false, hideDelete = false;
    const detailsAttributes = [
        'code',
        'name',
    ];
    const outerScope = 'project';
    const outerScopeId = project.id;
    const joinedData = {};
    const showComponent = undefined;

    if (isLoading) {
        return (
            <div className='wrapper-content register'>
                <Spinner />
            </div>
        );
    }

    function renderForm(data, onSubmit, onCancel) {
        return (
            <EventTypeForm
                data={data}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    }

    async function handleDeleteEventType(id, callback) {
        if (typeof callback === 'function') {
            callback();
        }
    }

    const sortedData = Object.values(data)
        .sort((a, b) => {
            const aName = a.name;
            const bName = b.name;
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
                            handleDelete={handleDeleteEventType}
                            disabled={isValidating}
                            key={`${scope}-${data.id}`}
                        />
                    ))}

                    {!hideAdd && (
                        <AddButton
                            scope={scope}
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
