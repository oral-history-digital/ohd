import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaEllipsisV } from 'react-icons/fa';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import VisuallyHidden from '@reach/visually-hidden';

import { AuthorizedContent } from 'modules/auth';
import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import BaseData from './BaseData';
import JoinedData from './JoinedData';
import DataDetailsContainer from './DataDetailsContainer';

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
    closeArchivePopup,
    deleteData,
}) {
    const [showVisible, setShowVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const openShowDialog = () => setShowVisible(true);
    const closeShowDialog = () => setShowVisible(false);
    const openEditDialog = () => setEditVisible(true);
    const closeEditDialog = () => setEditVisible(false);
    const openDeleteDialog = () => setDeleteVisible(true);
    const closeDeleteDialog = () => setDeleteVisible(false);

    const { t } = useI18n();

    function destroy() {
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
        closeArchivePopup();
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
                <Menu>
                    <MenuButton className="Button Button--transparent Button--icon">
                        <VisuallyHidden>Actions</VisuallyHidden>
                        <FaEllipsisV className="Icon Icon--small Icon--editorial" />
                    </MenuButton>
                    <MenuList>
                        {!hideShow && (
                            <MenuItem
                                className="ReachMenuItem"
                                onSelect={openShowDialog}
                            >
                                Show
                            </MenuItem>
                        )}
                        {!hideEdit && (
                            <MenuItem
                                className="ReachMenuItem"
                                onSelect={openEditDialog}
                            >
                                Edit
                            </MenuItem>
                        )}
                        {!hideDelete && (
                            <MenuItem
                                className="ReachMenuItem"
                                onSelect={openDeleteDialog}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>

                <Dialog
                    isOpen={showVisible}
                    onDismiss={closeShowDialog}
                    className="Modal-dialog"
                >
                    <h3 className="Modal-heading">
                        {name}
                    </h3>
                    <DataDetailsContainer
                        detailsAttributes={detailsAttributes}
                        data={data}
                        scope={scope}
                        optionsScope={optionsScope}
                    />
                    <button className="Modal-close" onClick={closeShowDialog}>
                        <VisuallyHidden>Close</VisuallyHidden>
                        <FaTimes className="Modal-icon" />
                    </button>
                </Dialog>

                <Dialog
                    isOpen={editVisible}
                    onDismiss={closeEditDialog}
                    className="Modal-dialog"
                >
                    <h3 className="Modal-heading">
                        {name} {t(`edit.${scope}.edit`)}
                    </h3>
                    {hideShow && (
                        <DataDetailsContainer
                            detailsAttributes={detailsAttributes}
                            data={data}
                            scope={scope}
                            optionsScope={optionsScope}
                        />
                    )}
                    {form(data, closeArchivePopup)}
                    <button className="Modal-close" onClick={closeEditDialog}>
                        <VisuallyHidden>Close</VisuallyHidden>
                        <FaTimes className="Modal-icon" />
                    </button>
                </Dialog>

                <Dialog
                    isOpen={deleteVisible}
                    onDismiss={closeDeleteDialog}
                    className="Modal-dialog"
                >
                    <h3 className="Modal-heading">
                        {t('delete')}
                    </h3>
                    <p>{name}</p>
                    <button
                        type="button"
                        className="Button any-button"
                        onClick={destroy}
                    >
                        {t('delete')}
                    </button>
                    <button className="Modal-close" onClick={closeDeleteDialog}>
                        <VisuallyHidden>Close</VisuallyHidden>
                        <FaTimes className="Modal-icon" />
                    </button>
                </Dialog>
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
    closeArchivePopup: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
};
