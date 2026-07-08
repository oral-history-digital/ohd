import classNames from 'classnames';
import { AuthorizedContent } from 'modules/auth';
import { useGetProject, useSensitiveData } from 'modules/data';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { PersonDetails } from 'modules/person';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { pluralize } from 'modules/strings';
import { AdminMenu } from 'modules/ui';
import PropTypes from 'prop-types';

import BaseData from './BaseData';
import DataDetails from './DataDetails';
import JoinedData from './JoinedData';
import getDataDisplayName from './getDataDisplayName';

const Item = AdminMenu.Item;

// Project rows in archive admin come from lightweight list payload.
// When editing a project, fetch the full payload for that single project only.
function ProjectEditContent({ data, form }) {
    const {
        project: fullProject,
        loading,
        mutate: mutateProject,
    } = useGetProject({ id: data?.id });

    if (loading && !fullProject) {
        return <Spinner withPadding />;
    }

    // Callback to refresh project data after successful form submission
    const onSubmit = () => {
        mutateProject();
    };

    return form(fullProject || data, onSubmit);
}

export default function Data({
    data,
    joinedData,
    task,
    form,
    scope,
    sensitiveAttributes = [],
    outerScope,
    outerScopeId,
    showComponent,
    hideShow,
    hideEdit,
    hideRegisterDoiAction = true,
    hideDelete,
    optionsScope,
    disabled = false,
    detailsAttributes,
    deleteData,
    registerDoi,
    handleDelete,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const pathBase = usePathBase();

    useSensitiveData(data, sensitiveAttributes);

    function destroy(close) {
        // Use custom delete handler if available, skip the rest.
        if (typeof handleDelete === 'function') {
            handleDelete(data.id, close);
            return;
        }

        // skip remove from state, only remove server-side
        deleteData(
            { locale, projectId, project },
            pluralize(scope),
            data.id,
            null,
            null,
            true
        );
        // only remove from state
        deleteData(
            { locale, projectId, project },
            outerScope ? pluralize(outerScope) : pluralize(scope),
            outerScopeId || data.id,
            outerScope ? pluralize(scope) : null,
            outerScope ? data.id : null,
            null,
            true
        );
        close();
    }

    function postDOI(close) {
        registerDoi(pathBase, pluralize(scope), data.id);
        close();
    }

    if (!data) {
        return null;
    }

    const displayName = getDataDisplayName(data, locale);

    return (
        <div
            className={classNames('data boxes', {
                'data-disabled': disabled,
                [`dataBox--${scope}`]: scope,
            })}
        >
            <BaseData
                name={displayName}
                data={data}
                scope={scope}
                showComponent={showComponent}
            />

            <AuthorizedContent object={[data, task]} action="update">
                <AdminMenu
                    disabled={disabled}
                    testIdPrefix={`${scope}-${data.id}`}
                >
                    {!hideShow && (
                        <Item
                            name="show"
                            label={t('edit.default.show')}
                            dialogTitle={displayName}
                        >
                            {scope === 'person' ? (
                                <PersonDetails data={data} />
                            ) : (
                                <DataDetails
                                    detailsAttributes={detailsAttributes}
                                    data={data}
                                    scope={scope}
                                    optionsScope={optionsScope}
                                />
                            )}
                        </Item>
                    )}
                    {!hideEdit && (
                        <Item
                            name="edit"
                            label={t('edit.default.edit')}
                            dialogTitle={`${displayName} ${t(`edit.${scope}.edit`)}`}
                        >
                            {(close) => (
                                <>
                                    {hideShow && (
                                        <DataDetails
                                            detailsAttributes={
                                                detailsAttributes
                                            }
                                            data={data}
                                            scope={scope}
                                            optionsScope={optionsScope}
                                        />
                                    )}
                                    {scope === 'project' ? (
                                        <ProjectEditContent
                                            data={data}
                                            form={(resolvedProject, onSubmit) =>
                                                form(
                                                    resolvedProject,
                                                    () => {
                                                        if (
                                                            typeof onSubmit ===
                                                            'function'
                                                        ) {
                                                            onSubmit();
                                                        }
                                                        close();
                                                    },
                                                    close
                                                )
                                            }
                                        />
                                    ) : (
                                        form(data, close, close)
                                    )}
                                </>
                            )}
                        </Item>
                    )}
                    {!hideRegisterDoiAction && (
                        <Item
                            name="register_doi"
                            label={t('register_doi')}
                            dialogTitle={`${displayName} ${t('register_doi')}`}
                        >
                            {(close) => (
                                <DeleteItemForm
                                    onSubmit={() => postDOI(close)}
                                    onCancel={close}
                                    submitTextKey="register_doi"
                                >
                                    <p>{displayName}</p>
                                </DeleteItemForm>
                            )}
                        </Item>
                    )}
                    {!hideDelete && (
                        <Item name="delete" label={t('delete')}>
                            {(close) => (
                                <DeleteItemForm
                                    onSubmit={() => destroy(close)}
                                    onCancel={close}
                                >
                                    <p>{displayName}</p>
                                </DeleteItemForm>
                            )}
                        </Item>
                    )}
                </AdminMenu>
            </AuthorizedContent>

            {joinedData && (
                <JoinedData joinedData={joinedData} data={data} scope={scope} />
            )}
        </div>
    );
}

Data.propTypes = {
    data: PropTypes.object.isRequired,
    joinedData: PropTypes.object,
    task: PropTypes.object,
    form: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    sensitiveAttributes: PropTypes.array,
    outerScope: PropTypes.string,
    outerScopeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    showComponent: PropTypes.elementType,
    hideShow: PropTypes.bool,
    hideEdit: PropTypes.bool,
    hideRegisterDoiAction: PropTypes.bool,
    hideDelete: PropTypes.bool,
    optionsScope: PropTypes.string,
    disabled: PropTypes.bool,
    detailsAttributes: PropTypes.array,
    registerDoi: PropTypes.func,
    deleteData: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
};

ProjectEditContent.propTypes = {
    data: PropTypes.object,
    form: PropTypes.func.isRequired,
};
