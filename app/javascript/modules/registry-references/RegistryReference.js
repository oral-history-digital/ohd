import { useEffect } from 'react';

import { useRegistryReferenceApi } from 'modules/api';
import { useAuthorization } from 'modules/auth';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import {
    useMutatePersonLandingPageMetadata,
    useMutatePersonWithAssociations,
} from 'modules/person';
import { usePathBase } from 'modules/routes';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import RegistryReferenceFormContainer from './RegistryReferenceFormContainer';

/**
 * Shows a registry reference with authorized editing and deletion controls.
 * Uses route-based URLs and preserves each owning entity's mutation refresh flow.
 *
 * @param {Object} props - Reference properties.
 * @param {Object} props.registryEntry - Entry name and notes by locale.
 * @param {Object} props.registryReference - Reference to display or delete.
 * @param {Object} props.registryEntriesStatus - Registry entry loading status.
 * @param {Object} props.refObject - Person, interview, or segment owning the reference.
 * @param {boolean} [props.hideEdit] - Hides editing and deletion controls.
 * @param {string} [props.contentLocale] - Preferred reference language.
 * @param {Object} props.registryEntries - Registry entries keyed by ID.
 * @param {number} [props.lowestAllowedRegistryEntryId] - Restricts the editable registry tree.
 * @param {boolean} [props.inTranscript] - Enables transcript editing behavior.
 * @param {number} [props.registryReferenceTypeId] - Restricts editing to this reference type.
 * @param {Function} [props.setOpenReference] - Toggles reference notes.
 * @param {Function} props.fetchData - Loads registry entries through Redux.
 * @param {Function} props.deleteData - Deletes interview or segment references through Redux.
 * @returns {React.ReactElement} Reference label and permitted controls.
 */
export default function RegistryReference({
    registryEntry,
    registryReference,
    registryEntriesStatus,
    refObject,
    hideEdit,
    contentLocale,
    registryEntries,
    lowestAllowedRegistryEntryId,
    inTranscript,
    registryReferenceTypeId,
    setOpenReference,
    fetchData,
    deleteData,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const { isAuthorized } = useAuthorization();
    const { deleteRegistryReference } = useRegistryReferenceApi();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata =
        useMutatePersonLandingPageMetadata();

    useEffect(() => {
        const id = registryReference.registry_entry_id;

        if (
            id &&
            (!registryEntriesStatus[id] ||
                registryEntriesStatus[id] !== 'fetching') &&
            (!registryEntries[id] ||
                (registryEntries[id] &&
                    !registryEntries[id].associations_loaded))
        ) {
            fetchData(
                { pathBase },
                'registry_entries',
                id,
                null,
                'with_associations=true'
            );
        }
    }, [
        pathBase,
        registryReference.registry_entry_id,
        registryEntriesStatus,
        registryEntries,
        fetchData,
    ]);

    /**
     * Starts deletion through the owning entity's existing cache refresh flow.
     *
     * @returns {Promise<void>} Resolves after starting the deletion.
     */
    async function destroy() {
        switch (refObject.type) {
            case 'Interview':
                deleteData(
                    { pathBase },
                    'interviews',
                    refObject.archiveId || refObject.archive_id || refObject.id,
                    'registry_references',
                    registryReference.id
                );
                break;
            case 'Person':
                mutatePersonWithAssociations(refObject.id, async () => {
                    const result = await deleteRegistryReference(
                        registryReference.id
                    );
                    mutatePersonLandingPageMetadata(refObject.id);
                    return result;
                });
                break;
            case 'Segment':
            default:
                deleteData(
                    { pathBase },
                    'registry_references',
                    registryReference.id,
                    null,
                    null,
                    true
                );
                break;
        }
    }

    const hasNote = !!(
        registryEntry.notes[contentLocale] || registryEntry.notes[locale]
    );

    /** Toggles the displayed notes for this registry entry. */
    function toggleOpenReference() {
        setOpenReference((currentReference) =>
            currentReference?.id === registryEntry.id ? null : registryEntry
        );
    }

    return (
        <li className="RegistryReference registry-reference">
            {hasNote && setOpenReference ? (
                <button
                    type="button"
                    id={'reference-' + registryReference.id}
                    className="RegistryReference-name RegistryReference-name--link"
                    onClick={toggleOpenReference}
                >
                    {registryEntry.name[contentLocale] ||
                        registryEntry.name[locale]}
                </button>
            ) : (
                <span
                    id={'reference-' + registryReference.id}
                    className="RegistryReference-name"
                >
                    {registryEntry.name[contentLocale] ||
                        registryEntry.name[locale]}
                </span>
            )}
            <span className="RegistryReference-buttons flyout-sub-tabs-content-ico">
                {registryReference &&
                    !hideEdit &&
                    isAuthorized(registryReference, 'update') &&
                    registryEntries[registryReference.registry_entry_id] &&
                    registryEntries[registryReference.registry_entry_id]
                        .associations_loaded && (
                        <Modal
                            title={t('edit.registry_reference.edit')}
                            trigger={
                                <FaPencilAlt className="Icon Icon--editorial Icon--small" />
                            }
                        >
                            {(close) => (
                                <RegistryReferenceFormContainer
                                    registryReference={registryReference}
                                    lowestAllowedRegistryEntryId={
                                        lowestAllowedRegistryEntryId
                                    }
                                    inTranscript={inTranscript}
                                    registryReferenceTypeId={
                                        registryReferenceTypeId
                                    }
                                    locale={locale}
                                    onSubmit={close}
                                    onCancel={close}
                                    goDeeper
                                />
                            )}
                        </Modal>
                    )}
                {registryReference &&
                    !hideEdit &&
                    isAuthorized(registryReference, 'destroy') && (
                        <Modal
                            title={t('edit.registry_reference.delete')}
                            trigger={
                                <FaTrash className="Icon Icon--editorial Icon--small" />
                            }
                        >
                            {(close) => (
                                <DeleteItemForm
                                    onSubmit={() => {
                                        destroy();
                                        close();
                                    }}
                                    onCancel={close}
                                >
                                    <p>
                                        {registryEntry.name[contentLocale] ||
                                            registryEntry.name[locale]}
                                    </p>
                                </DeleteItemForm>
                            )}
                        </Modal>
                    )}
            </span>
        </li>
    );
}

RegistryReference.propTypes = {
    hideEdit: PropTypes.bool,
    inTranscript: PropTypes.bool,
    lowestAllowedRegistryEntryId: PropTypes.number,
    registryReferenceTypeId: PropTypes.number,
    registryReference: PropTypes.object.isRequired,
    registryEntry: PropTypes.object,
    refObject: PropTypes.object,
    contentLocale: PropTypes.string,
    registryEntries: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    setOpenReference: PropTypes.func,
    deleteData: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
