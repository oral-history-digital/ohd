import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import { AdminMenu } from 'modules/ui';
import { useProject } from 'modules/routes';
import { DeleteItemForm } from 'modules/forms';
import { PersonDetails } from 'modules/person';
import BaseData from './BaseData';
import JoinedData from './JoinedData';
import DataDetails from './DataDetails';
import getDataDisplayName from './getDataDisplayName';
import { useSensitiveData } from 'modules/data';

const Item = AdminMenu.Item;

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
    hideDelete,
    optionsScope,
    disabled = false,
    detailsAttributes,
    deleteData,
    handleDelete,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    useSensitiveData(data, sensitiveAttributes);

    function destroy(close) {
        // Use custom delete handler if available, skip the rest.
        if (typeof handleDelete === 'function') {
            handleDelete(data.id, close);
            return;
        }

        // skip remove from state, only remove server-side
        deleteData({ locale, projectId, project }, pluralize(scope), data.id,
            null, null, true);
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
    data: PropTypes.object.isRequired,
    joinedData: PropTypes.object,
    task: PropTypes.object,
    form: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    outerScope: PropTypes.string,
    outerScopeId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    showComponent: PropTypes.element,
    hideShow: PropTypes.bool,
    hideEdit: PropTypes.bool,
    hideDelete: PropTypes.bool,
    disabled: PropTypes.bool,
    detailsAttributes: PropTypes.array,
    deleteData: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
};
