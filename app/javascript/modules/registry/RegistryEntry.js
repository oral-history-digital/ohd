import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';
import classNames from 'classnames';

import { AuthorizedContent, admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { Modal, Checkbox } from 'modules/ui';
import RegistryEntryShowContainer from './RegistryEntryShowContainer';
import RegistryEntries from './RegistryEntries';
import OpenStreetMapLink from './OpenStreetMapLink';
import RegistryEntryEditButtons from './RegistryEntryEditButtons';
import NormDataLinks from './NormDataLinks';
import RegistryEntryToggleChildren from './RegistryEntryToggleChildren';

export default class RegistryEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            childrenVisible: false,
        };

        this.showChildren = this.showChildren.bind(this);
    }

    componentDidMount() {
        this.reloadRegistryEntry();
    }

    componentDidUpdate() {
        this.reloadRegistryEntry();
    }

    reloadRegistryEntry() {
        const { registryEntries, registryEntriesStatus, data, fetchData } = this.props;

        if (
            (!registryEntries[data.id] && !registryEntriesStatus[data.id]) ||
            /^reload/.test(registryEntriesStatus[data.id])
        ) {
            fetchData(this.props, 'registry_entries', data.id);
        }
    }

    showChildren() {
        this.setState(prevState => ({ childrenVisible: !prevState.childrenVisible }));
    }

    entry() {
        const { data, locale, registryEntryParent } = this.props;

        const hasReferences = admin(this.props, {type: 'General'}, 'edit') ?
            data.registry_references_count > 0 :
            data.public_registry_references_count > 0;

        const localizedName = data.name[locale];
        const name = localizedName && localizedName.length > 0 ?
            localizedName :
            <i>{t(this.props, 'modules.registry.name_missing')}</i>;
        const displayName = (<>
            {name}
            <AuthorizedContent object={data} action='update'>
                {` (ID: ${data.id})`}
            </AuthorizedContent>
        </>);

        if (hasReferences) {
            return (
                <Modal
                    title={t(this.props, 'activerecord.models.registry_entry.actions.show')}
                    triggerClassName="Button Button--transparent Button--withoutPadding RegistryEntry-label is-clickable"
                    trigger={displayName}
                >
                    {close => (
                        <RegistryEntryShowContainer
                            registryEntryId={data.id}
                            registryEntryParent={registryEntryParent}
                            onSubmit={close}
                            normDataLinks={<NormDataLinks registryEntry={data} />}
                        />
                    )}
                </Modal>
            );
        } else {
            return (
                <span className="RegistryEntry-label">{displayName}</span>
            );
        }
    }

    render() {
        const { className, selectedRegistryEntryIds, data, addRemoveRegistryEntryId,
            registryEntryParent, children, hideEditButtons,
            hideCheckbox } = this.props;
        const { childrenVisible } = this.state;

        const showOpenStreetMapLink = data.latitude + data.longitude !== 0;
        const showEditButtons = !hideEditButtons;

        return (
            <li
                id={`entry_${data.id}`}
                className={classNames('RegistryEntry', className)}
            >
                <div className="RegistryEntry-content">
                    {!hideCheckbox && (
                        <AuthorizedContent object={{type: 'RegistryEntry'}} action='update'>
                            <Checkbox
                                className='select-checkbox'
                                checked={selectedRegistryEntryIds.includes(data.id)}
                                onChange={() => addRemoveRegistryEntryId(data.id)}
                            />
                        </AuthorizedContent>
                    )}

                    {showEditButtons && (
                        <RegistryEntryToggleChildren
                            count={data.children_count}
                            isOpen={childrenVisible}
                            onToggle={this.showChildren}
                        />
                    )}

                    {this.entry()}

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
                            <AuthorizedContent object={data} action="update">
                                <RegistryEntryEditButtons
                                    registryEntry={data}
                                    parentRegistryEntry={registryEntryParent}
                                />
                            </AuthorizedContent>
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
        )
    }
}

RegistryEntry.propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
    locale: PropTypes.string.isRequired,
    hideEditButtons: PropTypes.bool,
    hideCheckbox: PropTypes.bool,
    translations: PropTypes.object.isRequired,
    registryEntries: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    registryEntryParent: PropTypes.object.isRequired,
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    fetchData: PropTypes.func.isRequired,
    addRemoveRegistryEntryId: PropTypes.func.isRequired,
};
