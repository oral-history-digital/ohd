import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { deleteData } from 'modules/data';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { AdminMenu } from 'modules/ui';
import RegistryHierarchyFormContainer from './RegistryHierarchyFormContainer';
import RegistryEntryFormContainer from './RegistryEntryFormContainer';

const Item = AdminMenu.Item;

export default function RegistryEntryEditButtons({
    registryEntry,
    parentRegistryEntry,
}) {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    function destroy() {
        dispatch(
            deleteData(
                { project, projectId, locale },
                'registry_entries',
                registryEntry.id,
                null,
                null,
                true
            )
        );
    }

    function rmParent() {
        dispatch(
            deleteData(
                { project, projectId, locale },
                'registry_hierarchies',
                parentRegistryHierarchyId(),
                null,
                null,
                true
            )
        );
    }

    function parentRegistryHierarchyId() {
        return registryEntry.parent_registry_hierarchy_ids[
            parentRegistryEntry.id
        ];
    }

    return (
        <AdminMenu>
            <Item name="edit" label={t('edit.registry_entry.edit')}>
                {(close) => (
                    <RegistryEntryFormContainer
                        registryEntryId={registryEntry.id}
                        registryEntryParent={parentRegistryEntry}
                        onSubmit={close}
                        onCancel={close}
                    />
                )}
            </Item>
            <Item name="delete" label={t('delete')}>
                {(close) => (
                    <DeleteItemForm
                        onSubmit={() => {
                            destroy();
                            close();
                        }}
                        onCancel={close}
                    >
                        <p>{registryEntry.name[locale]}</p>
                    </DeleteItemForm>
                )}
            </Item>
            <Item name="new_child" label={t(`edit.registry_entry.new`)}>
                {(close) => (
                    <RegistryEntryFormContainer
                        registryEntryParent={registryEntry}
                        onSubmit={close}
                        onCancel={close}
                    />
                )}
            </Item>
            <Item name="add_parent" label={t('edit.registry_entry.add_parent')}>
                {(close) => (
                    <RegistryHierarchyFormContainer
                        descendantRegistryEntry={registryEntry}
                        onSubmit={close}
                        onCancel={close}
                    />
                )}
            </Item>
            {parentRegistryEntry && (
                <Item
                    name="delete_parent"
                    label={t('edit.registry_entry.delete_parent')}
                >
                    {(close) => (
                        <DeleteItemForm
                            onSubmit={() => {
                                rmParent();
                                close();
                            }}
                            onCancel={close}
                        >
                            <p>{parentRegistryEntry.name[locale]}</p>
                        </DeleteItemForm>
                    )}
                </Item>
            )}
        </AdminMenu>
    );
}

RegistryEntryEditButtons.propTypes = {
    registryEntry: PropTypes.object.isRequired,
    parentRegistryEntry: PropTypes.object.isRequired,
};
