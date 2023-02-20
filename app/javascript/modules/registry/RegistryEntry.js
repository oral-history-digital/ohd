import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaGlobeEurope, FaMinus, FaPlus }
    from 'react-icons/fa';
import classNames from 'classnames';

import { AdminMenu, Modal, Checkbox } from 'modules/ui';
import { AuthorizedContent, admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { DeleteItemForm } from 'modules/forms';
import RegistryHierarchyFormContainer from './RegistryHierarchyFormContainer';
import RegistryEntryShowContainer from './RegistryEntryShowContainer';
import RegistryEntryFormContainer from './RegistryEntryFormContainer';
import RegistryEntriesContainer from './RegistryEntriesContainer';

const Item = AdminMenu.Item;

export default class RegistryEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            childrenVisible: false,
            editButtonsVisible: false,
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
        if (
            (
                !this.props.registryEntries[this.props.data.id] &&
                !this.props.registryEntriesStatus[this.props.data.id]
            ) ||
            /^reload/.test(this.props.registryEntriesStatus[this.props.data.id])
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.data.id);
        }
    }

    destroy() {
        this.props.deleteData(this.props, 'registry_entries', this.props.data.id, null, null, true);
    }

    rmParent() {
        this.props.deleteData(this.props, 'registry_hierarchies', this.parentRegistryHierarchyId(), null, null, true);
    }

    parentRegistryHierarchyId() {
        return this.props.data.parent_registry_hierarchy_ids[this.props.registryEntryParent.id];
    }

    normDataLinks() {
        return this.props.data.norm_data.map( normDatum => {
            return (
                <>
                    <a
                        href={`${normDatum.norm_data_provider.url_without_id}${normDatum.nid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="Link flyout-sub-tabs-content-ico-link"
                        title={t(this.props, 'norm_data.link_hover')}
                    >
                        &nbsp;{normDatum.norm_data_provider.name}&nbsp;
                    </a>
                </>
            )
        })
    }

    osmLink() {
        if((this.props.data.latitude + this.props.data.longitude) !== 0 ) {
            return (
                <a
                    href={`https://www.openstreetmap.org/?mlat=${this.props.data.latitude}&mlon=${this.props.data.longitude}&zoom=6`}
                    target="_blank"
                    rel="noreferrer"
                    className="Link flyout-sub-tabs-content-ico-link"
                    title={`${this.props.data.latitude}, ${this.props.data.longitude}`}
                >
                    <FaGlobeEurope className="Icon Icon--primary" />
                </a>
            )
        }
        else {
            return null;
        }
    }

    buttons() {
        return (
            <div>
                <AuthorizedContent object={this.props.data} action='update'>
                    {this.normDataLinks()}
                </AuthorizedContent>
                {this.osmLink()}
                {this.editButtons()}
            </div>
        )
    }

    editButtons() {
        const { data, registryEntryParent, locale, hideEditButtons } = this.props;

        if (hideEditButtons) {
            return null;
        }

        return (
            <AuthorizedContent object={data} action='update'>
                <AdminMenu>
                    <Item
                        name="edit"
                        label={t(this.props, 'edit.registry_entry.edit')}
                    >
                        {close => (
                            <RegistryEntryFormContainer
                                registryEntryId={data.id}
                                registryEntryParent={registryEntryParent}
                                onSubmit={close}
                                onCancel={close}
                            />
                        )}
                    </Item>
                    <Item
                        name="delete"
                        label={t(this.props, 'delete')}
                    >
                        {close => (
                            <DeleteItemForm
                                onSubmit={() => {
                                    this.destroy();
                                    close();
                                }}
                                onCancel={close}
                            >
                                <p>{data.name[locale]}</p>
                            </DeleteItemForm>
                        )}
                    </Item>
                    <Item
                        name="new_child"
                        label={t(this.props, `edit.registry_entry.new`)}
                    >
                        {close => (
                            <RegistryEntryFormContainer
                                registryEntryParent={data}
                                onSubmit={close}
                                onCancel={close}
                            />
                        )}
                    </Item>
                    <Item
                        name="add_parent"
                        label={t(this.props, 'edit.registry_entry.add_parent')}
                    >
                        {close => (
                            <RegistryHierarchyFormContainer
                                descendantRegistryEntry={data}
                                onSubmit={close}
                                onCancel={close}
                            />
                        )}

                    </Item>
                    {registryEntryParent && (
                        <Item
                            name="delete_parent"
                            label={t(this.props, 'edit.registry_entry.delete_parent')}
                        >
                            {close => (
                                <DeleteItemForm
                                    onSubmit={() => { this.rmParent(); close(); }}
                                    onCancel={close}
                                >
                                    <p>{registryEntryParent.name[locale]}</p>
                                </DeleteItemForm>
                            )}
                        </Item>
                    )}
                </AdminMenu>
            </AuthorizedContent>
        );
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
                            normDataLinks={this.normDataLinks()}
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

    showHideChildren() {
        const { data } = this.props;
        const { childrenVisible } = this.state;

        if (data.children_count > 0) {
            return (
                <button
                    className="Button Button--transparent Button--icon RegistryEntry-toggleChildren"
                    title={`${data.children_count} ${t(this.props, 'edit.registry_entry.show_children')}`}
                    onClick={this.showChildren}
                    >
                    {
                        childrenVisible ?
                            <FaMinus className="Icon Icon--primary" /> :
                            <FaPlus className="Icon Icon--primary" />
                    }
                </button>
            );
        } else {
            return (
                <div className="RegistryEntry-toggleChildren" />
            );
        }
    }

    description() {
        if(this.props.data.desc !== ''){
            return (
                <div style={{color: 'grey', marginTop: '6px' }}>{this.props.data.desc}</div>
            )
        }
    }

    render() {
        const { className, selectedRegistryEntryIds, data, addRemoveRegistryEntryId,
            children, hideEditButtons } = this.props;

        return (
            <li
                id={`entry_${data.id}`}
                className={classNames('RegistryEntry', className)}
            >
                <div className="RegistryEntry-content">
                    { !this.props.hideCheckbox && <AuthorizedContent object={{type: 'RegistryEntry'}} action='update'>
                        <Checkbox
                            className='select-checkbox'
                            checked={selectedRegistryEntryIds.includes(data.id)}
                            onChange={() => addRemoveRegistryEntryId(data.id)}
                        />
                    </AuthorizedContent> }
                    {!hideEditButtons && this.showHideChildren()}
                    {this.entry()}
                    {this.buttons()}
                </div>
                {children}
                {
                    this.state.childrenVisible && (
                    <RegistryEntriesContainer
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
    translations: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    registryEntryParent: PropTypes.object.isRequired,
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    fetchData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    addRemoveRegistryEntryId: PropTypes.func.isRequired,
};
