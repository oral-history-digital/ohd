import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import { AdminMenu } from 'modules/ui';
import { DeleteItemForm } from 'modules/forms';
import { PersonDetails } from 'modules/person';
import BaseData from './BaseData';
import JoinedData from './JoinedData';
import DataDetails from './DataDetails';
import getDataDisplayName from './getDataDisplayName';

const Item = AdminMenu.Item;

export default function Data({
    data,
    joinedData,
    locale,
    projectId,
    projects,
    task,
    form,
    scope,
    outerScope,
    outerScopeId,
    showComponent,
    hideShow,
    hideEdit,
    hideDelete,
    optionsScope,
    disabled = false,
    detailsAttributes,
    deleteData,
    handleDelete,
}) {
    const { t } = useI18n();

    function destroy(close) {
        // Use custom delete handler if available, skip the rest.
        if (typeof handleDelete === 'function') {
            handleDelete(data.id, close);
            return;
        }

        // skip remove from state, only remove server-side
        deleteData({ locale, projectId, projects }, pluralize(scope), data.id,
            null, null, true);
        // only remove from state
        deleteData(
            { locale, projectId, projects },
            outerScope ? pluralize(outerScope) : pluralize(scope),
            outerScopeId || data.id,
            outerScope ? pluralize(scope) : null,
            outerScope ? data.id : null,
            null,
            true
        );
        close();
    }

    if (!data) {
        return null;
    }

    const displayName = getDataDisplayName(data, locale);

    return (
        <div className="data boxes">
            <BaseData
                name={displayName}
                data={data}
                scope={scope}
                showComponent={showComponent}
            />

            <AuthorizedContent object={[data, task]} action='update'>
                <AdminMenu disabled={disabled}>
                    {!hideShow && (
                        <Item
                            name="show"
                            label={t('edit.default.show')}
                            dialogTitle={displayName}
                        >
                            {scope === 'person' ?
                                <PersonDetails data={data} /> :
                                <DataDetails
                                    detailsAttributes={detailsAttributes}
                                    data={data}
                                    scope={scope}
                                    optionsScope={optionsScope}
                                />
                            }
                        </Item>
                    )}
                    {!hideEdit && (
                        <Item
                            name="edit"
                            label={t('edit.default.edit')}
                            dialogTitle={`${displayName} ${t(`edit.${scope}.edit`)}`}
                        >
                            {close => (
                                <>
                                    {hideShow && (
                                        <DataDetails
                                            detailsAttributes={detailsAttributes}
                                            data={data}
                                            scope={scope}
                                            optionsScope={optionsScope}
                                        />
                                    )}
                                    {form(data, close, close)}
                                </>
                            )}
                        </Item>
                    )}
                    {!hideDelete && (
                        <Item name="delete" label={t('delete')}>
                            {close => (
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
                <JoinedData
                    joinedData={joinedData}
                    data={data}
                    scope={scope}
                />
            )}
        </div>
    );
}

Data.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    joinedData: PropTypes.object,
    task: PropTypes.object,
    form: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    optionsScope: PropTypes.string.isRequired,
    outerScope: PropTypes.string,
    outerScopeId: PropTypes.string,
    showComponent: PropTypes.element,
    hideShow: PropTypes.bool,
    hideEdit: PropTypes.bool,
    hideDelete: PropTypes.bool,
    disabled: PropTypes.bool,
    detailsAttributes: PropTypes.array,
    deleteData: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
};
