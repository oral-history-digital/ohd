import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import RegistryReferenceContainer from './RegistryReferenceContainer';
import RegistryReferenceFormContainer from './RegistryReferenceFormContainer';

export default function RegistryReferences({
    registryEntriesStatus,
    registryEntries,
    registryReferenceTypeId,
    refObject,
    interview,
    inTranscript,
    lowestAllowedRegistryEntryId,
    contentLocale,
    setOpenReference,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();

    if (
        !registryEntriesStatus[project.root_registry_entry_id] ||
        registryEntriesStatus[project.root_registry_entry_id].split('-')[0] !==
            'fetched'
    ) {
        return null;
    }

    if (
        !refObject ||
        !registryEntriesStatus[
            `ref_object_type_${refObject.type}_ref_object_id_${refObject.id}`
        ] ||
        registryEntriesStatus[
            `ref_object_type_${refObject.type}_ref_object_id_${refObject.id}`
        ].split('-')[0] !== 'fetched'
    ) {
        return null;
    }

    if (!refObject.registry_references) {
        return null;
    }

    const refs = Object.values(refObject.registry_references)
        .filter(
            (ref) =>
                typeof registryEntries[ref.registry_entry_id]?.name[locale] ===
                'string'
        )
        .filter(
            (ref) =>
                (registryReferenceTypeId &&
                    registryReferenceTypeId ===
                        ref.registry_reference_type_id) ||
                !registryReferenceTypeId
        )
        .filter((ref) => ref.interview_id === interview.id);

    return (
        <>
            {refs.length > 0 && (
                <ul className="RegistryReferences-list">
                    {refs.map((ref) => (
                        <RegistryReferenceContainer
                            key={ref.id}
                            registryEntry={
                                registryEntries[ref.registry_entry_id]
                            }
                            registryReference={ref}
                            registryReferenceTypeId={registryReferenceTypeId}
                            refObject={refObject}
                            lowestAllowedRegistryEntryId={
                                lowestAllowedRegistryEntryId ||
                                project?.root_registry_entry_id
                            }
                            inTranscript={inTranscript}
                            contentLocale={contentLocale}
                            setOpenReference={setOpenReference}
                        />
                    ))}
                </ul>
            )}
            <AuthorizedContent
                object={{
                    type: 'RegistryReference',
                    interview_id: interview.id,
                }}
                action="create"
            >
                <Modal
                    title={t('edit.registry_reference.new')}
                    trigger={
                        <FaPlus className="Icon Icon--editorial Icon--small" />
                    }
                >
                    {(close) => (
                        <RegistryReferenceFormContainer
                            refObject={refObject}
                            interview={interview}
                            lowestAllowedRegistryEntryId={
                                lowestAllowedRegistryEntryId
                            }
                            inTranscript={inTranscript}
                            registryReferenceTypeId={registryReferenceTypeId}
                            locale={locale}
                            goDeeper
                            onSubmit={close}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
        </>
    );
}

RegistryReferences.propTypes = {
    refObject: PropTypes.object.isRequired,
    registryReferenceTypeId: PropTypes.number,
    inTranscript: PropTypes.bool,
    lowestAllowedRegistryEntryId: PropTypes.number,
    interview: PropTypes.object.isRequired,
    registryEntries: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    setOpenReference: PropTypes.func,
};
