import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import { Modal } from 'modules/ui';
import { useAuthorization } from 'modules/auth'
import { useI18n } from 'modules/i18n';
import {
    useMutatePersonWithAssociations,
    useMutatePersonLandingPageMetadata
} from 'modules/person';
import { DeleteItemForm } from 'modules/forms';
import { useRegistryReferenceApi } from 'modules/api';
import RegistryReferenceFormContainer from './RegistryReferenceFormContainer';

export default function RegistryReference({
    registryEntry,
    registryReference,
    registryEntriesStatus,
    refObject,
    hideEdit,
    locale,
    projectId,
    projects,
    registryEntries,
    lowestAllowedRegistryEntryId,
    inTranscript,
    registryReferenceTypeId,
    setOpenReference,
    fetchData,
    deleteData,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { deleteRegistryReference } = useRegistryReferenceApi();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata = useMutatePersonLandingPageMetadata();

    useEffect(() => {
        loadRegistryEntry();
    })

    function loadRegistryEntry() {
        const id = registryReference.registry_entry_id;

        if (
            id &&
            (!registryEntriesStatus[id] || registryEntriesStatus[id] !== 'fetching') &&
            (!registryEntries[id] || (registryEntries[id] && !registryEntries[id].associations_loaded))
        ) {
            fetchData({ locale, projectId, projects }, 'registry_entries', id, null, 'with_associations=true');
        }
    }

    async function destroy() {
        switch (refObject.type) {
        case 'Interview':
            deleteData({ locale, projectId, projects }, 'interviews', refObject.archiveId || refObject.archive_id || refObject.id,
                'registry_references', registryReference.id);
            break;
        case 'Person':
            mutatePersonWithAssociations(refObject.id, async () => {
                const result = await deleteRegistryReference(registryReference.id);
                mutatePersonLandingPageMetadata(refObject.id);
                return result;
            });
            break;
        case 'Segment':
        default:
            deleteData({ locale, projectId, projects }, 'registry_references', registryReference.id, null, null, true);
            break;
        }
    }

    const hasNote = !!registryEntry.notes[locale];

    return (
        <li className="RegistryReference registry-reference">
            {
                hasNote && setOpenReference ? (
                    <button
                        type="button"
                        id={"reference-" + registryReference.id}
                        className="RegistryReference-name RegistryReference-name--link"
                        onClick={() => setOpenReference(registryEntry)}
                    >
                        {registryEntry.name[locale]}
                    </button>
                ) : (
                    <span
                        id={"reference-" + registryReference.id}
                        className="RegistryReference-name"
                    >
                        {registryEntry.name[locale]}
                    </span>
                )
            }
            <span className="RegistryReference-buttons flyout-sub-tabs-content-ico">
                {
                    registryReference && !hideEdit && isAuthorized(registryReference, 'update') &&
                    registryEntries[registryReference.registry_entry_id] &&
                    registryEntries[registryReference.registry_entry_id].associations_loaded && (
                        <Modal
                            title={t('edit.registry_reference.edit')}
                            trigger={<FaPencilAlt className="Icon Icon--editorial Icon--small"/>}
                        >
                            {close => (
                                <RegistryReferenceFormContainer
                                    registryReference={registryReference}
                                    lowestAllowedRegistryEntryId={lowestAllowedRegistryEntryId}
                                    inTranscript={inTranscript}
                                    registryReferenceTypeId={registryReferenceTypeId}
                                    locale={locale}
                                    onSubmit={close}
                                    onCancel={close}
                                    goDeeper
                                />
                            )}
                        </Modal>
                    )
                }
                {
                    registryReference && !hideEdit && isAuthorized(registryReference, 'destroy') && (
                        <Modal
                            title={t('edit.registry_reference.delete')}
                            trigger={<FaTrash className="Icon Icon--editorial Icon--small"/>}
                        >
                            {close => (
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
                        </Modal>
                    )
                }
            </span>
        </li>
    );
}

RegistryReference.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    hideEdit: PropTypes.bool,
    inTranscript: PropTypes.bool,
    lowestAllowedRegistryEntryId: PropTypes.number,
    registryReferenceTypeId: PropTypes.number,
    registryReference: PropTypes.object.isRequired,
    registryEntry: PropTypes.object,
    refObject: PropTypes.object,
    registryEntries: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    setOpenReference: PropTypes.func,
    deleteData: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
