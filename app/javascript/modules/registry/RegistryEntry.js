import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Checkbox, Modal } from 'modules/ui';
import { getIsLoggedIn } from 'modules/user';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import NormDataLinks from './NormDataLinks';
import OpenStreetMapLink from './OpenStreetMapLink';
import RegistryEntries from './RegistryEntries';
import RegistryEntryEditButtons from './RegistryEntryEditButtons';
import RegistryEntryLabel from './RegistryEntryLabel';
import RegistryEntryShow from './RegistryEntryShow';
import RegistryEntryToggleChildren from './RegistryEntryToggleChildren';

/**
 * Displays a registry entry, reloads missing or invalidated data, and expands its children.
 * Entry requests use the current route; editing controls retain their authorization checks.
 *
 * @param {Object} props - Entry row properties.
 * @param {Function} props.addRemoveRegistryEntryId - Toggles the entry's selection.
 * @param {React.ReactNode} [props.children] - Additional content below the entry.
 * @param {string} [props.className] - Additional CSS class.
 * @param {Object} props.data - Entry to display.
 * @param {Function} props.fetchData - Loads registry entries through Redux.
 * @param {boolean} [props.hideCheckbox] - Hides the selection control.
 * @param {boolean} [props.hideEditButtons] - Hides editing and child-expansion buttons.
 * @param {Object} props.registryEntries - Cached entries keyed by ID.
 * @param {Object} props.registryEntriesStatus - Entry request status keyed by ID.
 * @param {Object} props.registryEntryParent - Parent used for entry editing.
 * @param {number[]} props.selectedRegistryEntryIds - Entries selected for bulk operations.
 * @returns {React.ReactElement} Entry row with permitted controls and optional children.
 */
export default function RegistryEntry({
    addRemoveRegistryEntryId,
    children,
    className,
    data,
    fetchData,
    hideCheckbox,
    hideEditButtons,
    registryEntries,
    registryEntriesStatus,
    registryEntryParent,
    selectedRegistryEntryIds,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const [childrenVisible, setChildrenVisible] = useState(false);

    const cachedEntry = registryEntries[data.id];
    const status = registryEntriesStatus[data.id];

    useEffect(() => {
        if ((!cachedEntry && !status) || /^reload/.test(status)) {
            fetchData({ pathBase }, 'registry_entries', data.id);
        }
    }, [data.id, cachedEntry, status, pathBase, fetchData]);

    function showChildren() {
        setChildrenVisible((prev) => !prev);
    }

    const showOpenStreetMapLink = data.latitude + data.longitude !== 0;
    const showEditButtons = !hideEditButtons;

    return (
        <li
            id={`entry_${data.id}`}
            className={classNames('RegistryEntry', className)}
        >
            <div className="RegistryEntry-content">
                {!hideCheckbox && (
                    <AuthorizedContent
                        object={{ type: 'RegistryEntry' }}
                        action="update"
                    >
                        <Checkbox
                            className="RegistryEntry-checkbox select-checkbox"
                            checked={selectedRegistryEntryIds.includes(data.id)}
                            onChange={() => addRemoveRegistryEntryId(data.id)}
                        />
                    </AuthorizedContent>
                )}

                {showEditButtons && (
                    <RegistryEntryToggleChildren
                        count={data.children_count}
                        isOpen={childrenVisible}
                        onToggle={showChildren}
                    />
                )}

                <>
                    {isLoggedIn && data.registry_references_count > 0 ? (
                        <Modal
                            title={t(
                                'activerecord.models.registry_entry.actions.show'
                            )}
                            triggerClassName="Button Button--transparent Button--withoutPadding RegistryEntry-label is-clickable"
                            trigger={
                                <RegistryEntryLabel registryEntry={data} />
                            }
                        >
                            {(close) => (
                                <RegistryEntryShow
                                    registryEntryId={data.id}
                                    onSubmit={close}
                                    normDataLinks={
                                        <NormDataLinks registryEntry={data} />
                                    }
                                />
                            )}
                        </Modal>
                    ) : (
                        <span className="RegistryEntry-label">
                            <RegistryEntryLabel registryEntry={data} />
                        </span>
                    )}
                    <AuthorizedContent object={data} action="update">
                        <span className="u-ml-tiny">{`(ID: ${data.id})`}</span>
                    </AuthorizedContent>
                </>

                <div>
                    <AuthorizedContent object={data} action="update">
                        <NormDataLinks registryEntry={data} />
                    </AuthorizedContent>

                    {showOpenStreetMapLink && (
                        <OpenStreetMapLink
                            lat={data.latitude}
                            lng={data.longitude}
                        />
                    )}

                    {showEditButtons && (
                        <span className="u-ml-tiny">
                            <AuthorizedContent object={data} action="update">
                                <RegistryEntryEditButtons
                                    registryEntry={data}
                                    parentRegistryEntry={registryEntryParent}
                                />
                            </AuthorizedContent>
                        </span>
                    )}
                </div>
            </div>

            {children}

            {childrenVisible && (
                <RegistryEntries
                    className="RegistryEntry-children"
                    registryEntryParent={data}
                />
            )}
        </li>
    );
}

RegistryEntry.propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
    hideEditButtons: PropTypes.bool,
    hideCheckbox: PropTypes.bool,
    registryEntries: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    registryEntryParent: PropTypes.object.isRequired,
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    fetchData: PropTypes.func.isRequired,
    addRemoveRegistryEntryId: PropTypes.func.isRequired,
};
