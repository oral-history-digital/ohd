import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import { AdminMenu } from 'modules/ui';
import BaseData from './BaseData';
import JoinedData from './JoinedData';
import DataDetailsContainer from './DataDetailsContainer';

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
    detailsAttributes,
    deleteData,
}) {
    const { t } = useI18n();

    function destroy(close) {
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

    const name = data.title ||
        (data.name?.hasOwnProperty(locale) ? data.name[locale] : data.name);

    return (
        <div className="data boxes">
            <BaseData
                name={name}
                data={data}
                scope={scope}
                showComponent={showComponent}
            />

            <AuthorizedContent object={[data, task]} action='update'>
                <AdminMenu>
                    {!hideShow && (
                        <Item
                            name="show"
                            label="Anzeigen"
                            dialogTitle={name}
                        >
                            <DataDetailsContainer
                                detailsAttributes={detailsAttributes}
                                data={data}
                                scope={scope}
                                optionsScope={optionsScope}
                            />
                        </Item>
                    )}
                    {!hideEdit && (
                        <Item
                            name="edit"
                            label="Bearbeiten"
                            dialogTitle={`${name} ${t(`edit.${scope}.edit`)}`}
                        >
                            {close => (
                                <>
                                    {hideShow && (
                                        <DataDetailsContainer
                                            detailsAttributes={detailsAttributes}
                                            data={data}
                                            scope={scope}
                                            optionsScope={optionsScope}
                                        />
                                    )}
                                    {form(data, close)}
                                </>
                            )}
                        </Item>
                    )}
                    {!hideDelete && (
                        <Item name="delete" label={t('delete')}>
                            {close => (
                                <>
                                    <p>{name}</p>
                                    <button
                                        type="button"
                                        className="Button any-button"
                                        onClick={() => destroy(close)}
                                    >
                                        {t('delete')}
                                    </button>
                                </>
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
    detailsAttributes: PropTypes.array,
    deleteData: PropTypes.func.isRequired,
};
