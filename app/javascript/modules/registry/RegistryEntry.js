import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
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
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const { isAuthorized } = useAuthorization();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const [childrenVisible, setChildrenVisible] = useState(false);

    useEffect(() => {
        reloadRegistryEntry();
    });

    function reloadRegistryEntry() {
        if (
            (!registryEntries[data.id] && !registryEntriesStatus[data.id]) ||
            /^reload/.test(registryEntriesStatus[data.id])
        ) {
            fetchData(
                { project, projectId, locale },
                'registry_entries',
                data.id
            );
        }
    }

    function showChildren() {
        setChildrenVisible((prev) => !prev);
    }

    function hasReferences() {
        return isAuthorized({ type: 'General' }, 'edit')
            ? data.registry_references_count > 0
            : data.public_registry_references_count > 0;
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
                    {isLoggedIn && hasReferences() ? (
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
                        <RegistryEntryLabel registryEntry={data} />
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
