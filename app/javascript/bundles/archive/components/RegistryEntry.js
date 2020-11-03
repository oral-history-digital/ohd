import React from 'react';
import RegistryEntryFormContainer from '../containers/RegistryEntryFormContainer';
import RegistryEntryShowContainer from '../containers/RegistryEntryShowContainer';
import RegistryEntriesContainer from '../containers/RegistryEntriesContainer';
import RegistryHierarchyFormContainer from '../containers/RegistryHierarchyFormContainer';
import PopupMenu from './PopupMenu';
import { t, pluralize, admin } from '../../../lib/utils';

export default class RegistryEntry extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            childrenVisible: false,
            editButtonsVisible: false,
        };
    }

    componentDidMount() {
        this.reloadRegistryEntry();
    }

    componentDidUpdate() {
        this.reloadRegistryEntry();
    }

    reloadRegistryEntry() {
        if (
            this.props.registryEntriesStatus[this.props.data.id] &&
            this.props.registryEntriesStatus[this.props.data.id].split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.data.id);
        }
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.edit')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.edit'),
                        content: <RegistryEntryFormContainer
                            registryEntry={this.props.data}
                            registryEntryParent={this.props.registryEntryParent}
                            />
                    })
                }}
            >
                <i className="fa fa-pencil" />
                {t(this.props, 'edit.registry_entry.edit')}
            </div>
        )
    }

    show() {
        if (this.props.data.registry_references_count > 0) {

            return (
                <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'activerecord.models.registry_entries.actions.show')}
                onClick={() => this.props.openArchivePopup({
                    // title: this.props.data.name[this.props.locale],
                    content: <RegistryEntryShowContainer
                    registryEntryId={this.props.data.id}
                    registryEntryParent={this.props.registryEntryParent}
                    />
                    })}
                >
                    <i className="fa fa-eye" />
                </div>
            )
        } else {
            return <div className='flyout-sub-tabs-content-ico-link' />;
        }
    }

    destroy() {
        this.props.deleteData(this.props, 'registry_entries', this.props.data.id, null, null, true);
        this.props.closeArchivePopup();
    }

    delete() {
        if (this.props.data) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'delete')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'delete'),
                        content: (
                            <div>
                                <p>{this.props.data.name[this.props.locale]}</p>
                                <div className='any-button' onClick={() => this.destroy()}>
                                    {t(this.props, 'delete')}
                                </div>
                            </div>
                        )
                    })
                }}
            >
                <i className="fa fa-trash-o" />
                {t(this.props, 'delete')}
            </div>
        } else {
            return null;
        }
    }

    rmParent() {
        this.props.deleteData(this.props, 'registry_hierarchies', this.parentRegistryHierarchyId(), null, null, true);
        this.props.closeArchivePopup();
    }

    parentRegistryHierarchyId() {
        return this.props.data.parent_registry_hierarchy_ids[this.props.registryEntryParent.id];
    }

    deleteParent() {
        if (this.props.registryEntryParent) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.delete_parent')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.delete_parent'),
                        content: (
                            <div>
                                <p>{this.props.registryEntryParent.name[this.props.locale]}</p>
                                <div className='any-button' onClick={() => this.rmParent()}>
                                    {t(this.props, 'delete')}
                                </div>
                            </div>
                        )
                    })
                }}
            >
                <i className="fa fa-minus-circle" />
                {t(this.props, 'edit.registry_entry.delete_parent')}
            </div>
        } else {
            return null;
        }
    }

    addParent() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.add_parent')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.add_parent'),
                        content: <RegistryHierarchyFormContainer
                                     descendantRegistryEntry={this.props.data}
                                 />
                    })
                }}
            >
                <i className="fa fa-sitemap" style={{'transform': 'rotate(180deg)'}} />
                {t(this.props, 'edit.registry_entry.add_parent')}
            </div>
        )
    }

    addRegistryEntry() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.new')}
                onClick={() => {
                    this.setState({ editButtonsVisible: false });
                    this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.new'),
                        content: <RegistryEntryFormContainer
                                    registryEntryParent={this.props.data}
                                />
                    })
                }}
            >
                <i className="fa fa-sitemap" />
                {t(this.props, 'edit.registry_entry.new')}
            </div>
        )
    }

    osmLink() {
        if((this.props.data.latitude + this.props.data.longitude) !== 0 ) {
            return (
                <a
                    href={`https://www.openstreetmap.org/?mlat=${this.props.data.latitude}&mlon=${this.props.data.longitude}&zoom=6`}
                    target="_blank"
                    rel="noopener"
                    className="flyout-sub-tabs-content-ico-link"
                    title={`${this.props.data.latitude}, ${this.props.data.longitude}`}
                >
                    <i className='fa fa-globe' />
                    &nbsp;
                </a>
            )
        }
        else {
            return null;
        }
    }

    buttons() {
        return (
            <div className={'flyout-sub-tabs-content-ico'}>
                {this.show()}
                {this.osmLink()}
                {this.editButtons()}
            </div>
        )
    }

    editButtons() {
        if (admin(this.props, this.props.data)) {
            return (
                <PopupMenu translations={this.props.translations} locale={this.props.locale}>
                    <PopupMenu.Item>{this.edit()}</PopupMenu.Item>
                    <PopupMenu.Item>{this.delete()}</PopupMenu.Item>
                    <PopupMenu.Item>{this.addRegistryEntry()}</PopupMenu.Item>
                    <PopupMenu.Item>{this.addParent()}</PopupMenu.Item>
                    <PopupMenu.Item>{this.deleteParent()}</PopupMenu.Item>
                </PopupMenu>
            );
        }
    }

    showChildren() {
        if (this.props.data.children_count > 0) {
             this.setState({ childrenVisible: !this.state.childrenVisible })
        }
    }

    showId() {
        if (admin(this.props, this.props.data)) {
            return ` (ID: ${this.props.data.id})`
        }
    }

    entry() {
        let css = this.state.childrenVisible ? 'open' : '';
        return (
            <div
                id={`entry_${this.props.data.id}`}
                key={"entry-" + this.props.data.id}
                className={`registry-entry-label ${css}`}
                title={this.props.data.name[this.props.locale]}
                onClick={() => this.showChildren()}
            >
                {this.props.data.name[this.props.locale]}
                {/* {(this.props.data.child_ids[this.props.locale].length > 0) && ` (${this.props.data.child_ids[this.props.locale].length})`} */}
                {this.showId()}
            </div>
        )
    }

    children() {
        if (this.state.childrenVisible) {
            return <RegistryEntriesContainer registryEntryParent={this.props.data} />;
        }
    }

    showHideChildren() {
        if (this.props.data.children_count > 0) {

            let css = this.state.childrenVisible ? 'minus-square' : 'plus-square-o';
            return (
                <div
                    className='show-hide-children'
                    title={`${this.props.data.children_count} ${t(this.props, 'edit.registry_entry.show_children')}`}
                    onClick={() => this.setState({ childrenVisible: !this.state.childrenVisible })}
                    >
                    <i className={`fa fa-${css}`}></i>
                </div>
            )
        } else {
            return (
            <div className='show-hide-children'>
                    <i className={`fa fa-square`} />
            </div>
            )
        }
    }

    description() {
        if(this.props.data.desc !== ''){
            return (
                <div style={{color: 'grey', marginTop: '6px' }}>{this.props.data.desc}</div>
            )
        }
    }

    renderCheckbox() {
        if (admin(this.props, {type: 'RegistryEntry', action: 'update'})) {
            return (
                <input
                    type='checkbox'
                    className='select-checkbox'
                    checked={this.props.selectedRegistryEntryIds.indexOf(this.props.data.id) > 0}
                    onChange={() => {this.props.addRemoveRegistryEntryId(this.props.data.id)}}
                />
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {this.renderCheckbox()}
                {this.showHideChildren()}
                {this.entry()}
                {this.buttons()}
                {this.children()}
                {/* {this.description()} */}
            </div>
        )
    }
}
