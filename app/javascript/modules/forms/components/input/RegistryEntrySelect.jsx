import { useEffect, useState } from 'react';

import {
    fetchData,
    getRegistryEntries,
    getRegistryEntriesStatus,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaArrowUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import SelectField from './SelectField';

/**
 * Browses registry entries using the project root and transcript visibility configuration.
 * @param {Object} props - Selected value, navigation options, and form callbacks.
 * @returns {React.ReactElement} Registry selector or project loading/error state.
 */
export default function RegistryEntrySelect({
    data,
    attribute,
    scope,
    help,
    handleChange,
    handleErrors,
    goDeeper,
    inTranscript,
}) {
    const {
        project,
        isLoading: projectLoading,
        error: projectError,
    } = useProject({ include: ['registry_configuration'] });
    const pathBase = usePathBase();
    const projectReady = Boolean(project && !projectLoading && !projectError);
    const { locale, t } = useI18n();

    const registryEntriesStatus = useSelector(getRegistryEntriesStatus);
    const registryEntries = useSelector(getRegistryEntries);
    const dispatch = useDispatch();

    const [selectedId, setSelectedRegistryEntryId] = useState(
        data?.[attribute]
    );
    const selectedRegistryEntryId =
        selectedId ?? project?.root_registry_entry_id;

    const selectedEntryStatus = registryEntriesStatus[selectedRegistryEntryId];
    const childrenForEntryStatus =
        registryEntriesStatus[`children_for_entry_${selectedRegistryEntryId}`];

    useEffect(() => {
        if (!projectReady) return;
        if (
            selectedRegistryEntryId &&
            (!registryEntriesStatus[selectedRegistryEntryId] ||
                registryEntriesStatus[selectedRegistryEntryId] !==
                    'fetching') &&
            (!registryEntries[selectedRegistryEntryId] ||
                (registryEntries[selectedRegistryEntryId] &&
                    !registryEntries[selectedRegistryEntryId]
                        .associations_loaded))
        ) {
            dispatch(
                fetchData(
                    { pathBase },
                    'registry_entries',
                    selectedRegistryEntryId,
                    null,
                    'with_associations=true'
                )
            );
        }
    }, [
        selectedRegistryEntryId,
        selectedEntryStatus,
        registryEntriesStatus,
        registryEntries,
        dispatch,
        locale,
        projectReady,
        pathBase,
    ]);

    useEffect(() => {
        if (!projectReady) return;
        if (
            (selectedRegistryEntryId && !childrenForEntryStatus) ||
            (registryEntriesStatus[selectedRegistryEntryId] &&
                registryEntriesStatus[selectedRegistryEntryId].split('-')[0] ===
                    'reload')
        ) {
            dispatch(
                fetchData(
                    { pathBase },
                    'registry_entries',
                    null,
                    null,
                    `children_for_entry=${selectedRegistryEntryId}`
                )
            );
        }
    }, [
        selectedRegistryEntryId,
        childrenForEntryStatus,
        registryEntriesStatus,
        dispatch,
        locale,
        projectReady,
        pathBase,
    ]);

    const parentRegistryEntryId = () => {
        if (
            registryEntries[selectedRegistryEntryId] &&
            registryEntries[selectedRegistryEntryId].associations_loaded
        ) {
            return registryEntries[selectedRegistryEntryId].parent_ids[0];
        } else {
            return null;
        }
    };

    const selectedRegistryEntry = () => {
        return registryEntries[selectedRegistryEntryId];
    };

    const registryEntriesToSelect = () => {
        if (
            // Check whether selected entry is loaded
            selectedRegistryEntry() &&
            selectedRegistryEntry().associations_loaded &&
            registryEntriesStatus[selectedRegistryEntryId]?.split('-')[0] ===
                'fetched' &&
            // Check whether childEntries are loaded
            registryEntriesStatus[
                `children_for_entry_${selectedRegistryEntryId}`
            ]?.split('-')[0] === 'fetched'
        ) {
            return selectedRegistryEntry()
                .child_ids[locale]?.filter((rid) => {
                    return (
                        !inTranscript ||
                        !(project.hidden_transcript_registry_entry_ids || [])
                            .map(String)
                            .includes(String(rid))
                    );
                })
                .map((id) => {
                    return registryEntries[id];
                });
        } else {
            return [];
        }
    };

    const handleSelectedRegistryEntry = (_, value) => {
        if (goDeeper) {
            if (
                !registryEntries[value] ||
                !registryEntries[value].associations_loaded
            )
                dispatch(
                    fetchData(
                        { pathBase },
                        'registry_entries',
                        value,
                        null,
                        'with_associations=true'
                    )
                );
            setSelectedRegistryEntryId(parseInt(value));
        }
    };

    const showSelectedRegistryEntry = () => {
        if (selectedRegistryEntry()) {
            return (
                <div>
                    <span>
                        <b>{t('selected_registry_entry') + ': '}</b>
                    </span>
                    <span>{selectedRegistryEntry().name[locale]}</span>
                </div>
            );
        } else {
            return null;
        }
    };

    const goUp = () => {
        const valid =
            parseInt(selectedRegistryEntryId) !==
            project?.root_registry_entry_id;
        if (
            selectedRegistryEntry() &&
            parseInt(selectedRegistryEntryId) !==
                project?.root_registry_entry_id &&
            selectedRegistryEntry().associations_loaded
        ) {
            return (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t('edit.registry_entry.go_up')}
                    onClick={() => {
                        setSelectedRegistryEntryId(parentRegistryEntryId());
                        handleErrors(attribute, valid);
                    }}
                >
                    {t('edit.registry_entry.go_up')}
                    <FaArrowUp className="Icon Icon--editorial" />
                </button>
            );
        }
    };

    const goDown = () => {
        const valid =
            parseInt(selectedRegistryEntryId) !==
            project?.root_registry_entry_id;
        if (
            selectedRegistryEntry() &&
            selectedRegistryEntry().associations_loaded &&
            selectedRegistryEntry().child_ids[locale].length > 0
        ) {
            return (
                <SelectField
                    attribute={attribute}
                    scope={scope}
                    value={selectedRegistryEntryId}
                    values={registryEntriesToSelect()}
                    withEmpty={true}
                    validate={function (v) {
                        return /\d+/.test(parseInt(v));
                    }}
                    valid={valid}
                    showErrors={true}
                    individualErrorMsg={'empty'}
                    handlechangecallback={handleSelectedRegistryEntry}
                    handleChange={handleChange}
                    handleErrors={handleErrors}
                    help={help}
                />
            );
        } else {
            return t('edit.registry_entry.no_more_children');
        }
    };

    if (projectError)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={projectError.message}
                isClosable={false}
            />
        );
    if (!projectReady) return <Spinner />;

    return (
        <div>
            {showSelectedRegistryEntry()}
            {goUp()}
            {goDown()}
        </div>
    );
}

RegistryEntrySelect.propTypes = {
    data: PropTypes.object,
    attribute: PropTypes.string,
    scope: PropTypes.string,
    help: PropTypes.string,
    handleChange: PropTypes.func,
    handleErrors: PropTypes.func,
    goDeeper: PropTypes.bool,
    inTranscript: PropTypes.bool,
    value: PropTypes.any,
    accept: PropTypes.string,
    elementType: PropTypes.string,
    condition: PropTypes.bool,
};
