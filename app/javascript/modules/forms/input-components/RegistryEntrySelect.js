import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import Select from './SelectContainer';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function RegistryEntrySelect({
    data,
    attribute,
    registryEntriesStatus,
    registryEntries,
    scope,
    help,
    handleChange,
    handleErrors,
    goDeeper,
    inTranscript,
    fetchData,
}) {
    const { project } = useProject();
    const { locale, t } = useI18n();

    const [selectedRegistryEntryId, setSelectedRegistryEntryId] = useState(
        data?.[attribute] || project?.root_registry_entry_id);
    const [valid, setValid] = useState(selectedRegistryEntryId !== project?.root_registry_entry_id);

    useEffect(() => {
        if (
            selectedRegistryEntryId &&
            (
                !registryEntriesStatus[selectedRegistryEntryId] ||
                registryEntriesStatus[selectedRegistryEntryId] !== 'fetching'
            ) && (
                !registryEntries[selectedRegistryEntryId] ||
                (
                    registryEntries[selectedRegistryEntryId] &&
                    !registryEntries[selectedRegistryEntryId].associations_loaded
                )
            )
        ) {
            fetchData({locale, project}, 'registry_entries', selectedRegistryEntryId, null, 'with_associations=true');
        }
    }, [registryEntriesStatus[selectedRegistryEntryId]]);

    useEffect(() => {
        if (
            selectedRegistryEntryId &&
            !registryEntriesStatus[`children_for_entry_${selectedRegistryEntryId}`] ||
            (
                registryEntriesStatus[selectedRegistryEntryId] &&
                registryEntriesStatus[selectedRegistryEntryId].split('-')[0] === 'reload'
            )
        ) {
            fetchData({locale, project}, 'registry_entries', null, null, `children_for_entry=${selectedRegistryEntryId}`);
        }
    }, [registryEntriesStatus[`children_for_entry_${selectedRegistryEntryId}`]]);

    const parentRegistryEntryId = () => {
        if (
            registryEntries[selectedRegistryEntryId] &&
            registryEntries[selectedRegistryEntryId].associations_loaded
        ) {
            return registryEntries[selectedRegistryEntryId].parent_ids[0];
        } else {
            return null;
        }
    }

    const selectedRegistryEntry = () => {
        return registryEntries[selectedRegistryEntryId];
    }

    const registryEntriesToSelect = () => {
        if (
            // check whether selected entry is loaded
            selectedRegistryEntry() &&
            selectedRegistryEntry().associations_loaded &&
            registryEntriesStatus[selectedRegistryEntryId]?.split('-')[0] === 'fetched' &&

            // check whether childEntries are loaded
            registryEntriesStatus[`children_for_entry_${selectedRegistryEntryId}`]?.split('-')[0] === 'fetched'
        ) {
            return selectedRegistryEntry().child_ids[locale]?.filter(rid => {
                return !inTranscript || project.hidden_transcript_registry_entry_ids.indexOf(rid.toString()) === -1
            }).map((id, index) => {
                return registryEntries[id];
            })
        } else {
            return [];
        }
    }

    const handleSelectedRegistryEntry = (name, value) => {
        if (goDeeper) {
            if (!registryEntries[value] || !registryEntries[value].associations_loaded)
                fetchData({locale, project}, 'registry_entries', value, null, 'with_associations=true');
            setSelectedRegistryEntryId(parseInt(value));
        }
    }

    const showSelectedRegistryEntry = () => {
        if (selectedRegistryEntry()) {
            return (
                <div>
                    <span><b>{t('selected_registry_entry') + ': '}</b></span>
                    <span>{selectedRegistryEntry().name[locale]}</span>
                </div>
            )
        } else {
            return null;
        }
    }

    const goUp = () => {
        const valid = parseInt(selectedRegistryEntryId) !== project?.root_registry_entry_id;
        if (
            selectedRegistryEntry() &&
            parseInt(selectedRegistryEntryId) !== project?.root_registry_entry_id &&
            selectedRegistryEntry().associations_loaded
        ) {
            return (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t( 'edit.registry_entry.go_up')}
                    onClick={() => {
                        setValid(valid);
                        setSelectedRegistryEntryId(parentRegistryEntryId());
                        handleErrors(attribute, valid);
                    }}
                >
                    {t('edit.registry_entry.go_up')}
                    <FaArrowUp className="Icon Icon--editorial" />
                </button>
            )
        }
    }

    const goDown = () => {
        const valid = parseInt(selectedRegistryEntryId) !== project?.root_registry_entry_id;
        if (
            selectedRegistryEntry() &&
            selectedRegistryEntry().associations_loaded &&
            selectedRegistryEntry().child_ids[locale].length > 0
        ) {
            return (
                <Select
                    attribute={attribute}
                    scope={scope}
                    value={selectedRegistryEntryId}
                    values={registryEntriesToSelect()}
                    withEmpty={true}
                    validate={function(v){return /\d+/.test(parseInt(v))}}
                    valid={valid}
                    showErrors={true}
                    individualErrorMsg={'empty'}
                    handlechangecallback={handleSelectedRegistryEntry}
                    handleChange={handleChange}
                    handleErrors={handleErrors}
                    help={help}
                />
            )
        } else {
            return t('edit.registry_entry.no_more_children');
        }
    }

    return (
        <div>
            {showSelectedRegistryEntry()}
            {goUp()}
            {goDown()}
        </div>
    );
}
