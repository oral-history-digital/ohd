import classNames from 'classnames';
import { registerDoi } from 'modules/archive';
import { AuthorizedContent } from 'modules/auth';
import { deleteData, useProjectDetail, useSensitiveData } from 'modules/data';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { PersonDetails } from 'modules/person';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { camelCase, pluralize } from 'modules/strings';
import { AdminMenu, InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { getDataDisplayName } from '../utils';
import BaseData from './BaseData';
import DataDetails from './DataDetails';
import JoinedData from './JoinedData';

const Item = AdminMenu.Item;

/**
 * Loads editable project details and stored translations for administration dialogs.
 *
 * @param {Object} props - Dialog properties.
 * @param {Object} props.data - Project summary with its shortname or ID.
 * @param {Function} props.children - Renders loaded project data.
 * @returns {React.ReactElement} Dialog content, loading indicator, or error.
 */
function ProjectAdminContent({ data, children }) {
    const { t } = useI18n();
    const { project, isLoading, error } = useProjectDetail(
        data?.shortname || data?.id,
        {
            profile: 'edit',
            include: ['translations'],
        }
    );

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner withPadding />;

    // The existing save endpoint accepts comma-separated locales; Redux retains the array.
    return children({
        ...project,
        pseudo_available_locales: project.available_locales.join(','),
    });
}

export default function AdminRecord({
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
    handleDelete,
}) {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    useSensitiveData(data, sensitiveAttributes);

    function destroy(close) {
        // Use custom delete handler if available, skip the rest.
        if (typeof handleDelete === 'function') {
            handleDelete(data.id, close);
            return;
        }

        // TODO: Replace deleteData's positional flags with explicit server and state deletion actions.
        // skip remove from state, only remove server-side
        dispatch(
            deleteData(
                { pathBase },
                pluralize(scope),
                data.id,
                null,
                null,
                true
            )
        );
        // only remove from state
        dispatch(
            deleteData(
                { pathBase },
                outerScope ? pluralize(outerScope) : pluralize(scope),
                outerScopeId || data.id,
                outerScope ? pluralize(scope) : null,
                outerScope ? data.id : null,
                null,
                true
            )
        );
        close();
    }

    function postDOI(close) {
        dispatch(registerDoi(pathBase, pluralize(scope), data.id));
        close();
    }

    if (!data) {
        return null;
    }

    const displayName = getDataDisplayName(data, locale);
    // API records omit the Rails class name; the configured resource scope supplies it for permission checks.
    const authorizationRecord = {
        ...data,
        type: data.type || camelCase(scope),
    };

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

            <AuthorizedContent
                object={[authorizationRecord, task]}
                action="update"
            >
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
                            ) : scope === 'project' ? (
                                <ProjectAdminContent data={data}>
                                    {(fullProject) => (
                                        <DataDetails
                                            detailsAttributes={
                                                detailsAttributes
                                            }
                                            data={fullProject}
                                            scope={scope}
                                            optionsScope={optionsScope}
                                        />
                                    )}
                                </ProjectAdminContent>
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
                                        <ProjectAdminContent data={data}>
                                            {(resolvedProject) =>
                                                form(
                                                    resolvedProject,
                                                    close,
                                                    close
                                                )
                                            }
                                        </ProjectAdminContent>
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

AdminRecord.propTypes = {
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
    handleDelete: PropTypes.func,
};

ProjectAdminContent.propTypes = {
    data: PropTypes.object,
    children: PropTypes.func.isRequired,
};
