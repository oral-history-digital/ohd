import React from 'react';

import RegistryEntryFormContainer from '../containers/RegistryEntryFormContainer';
import RegistryEntryShowContainer from '../containers/RegistryEntryShowContainer';
import RegistryEntriesContainer from '../containers/RegistryEntriesContainer';
import RegistryHierarchyFormContainer from '../containers/RegistryHierarchyFormContainer';
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
            this.props.registryEntriesStatus[this.props.registryEntry.id] &&
            this.props.registryEntriesStatus[this.props.registryEntry.id].split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.registryEntry.id);
        }
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_entry.edit'),
                    content: <RegistryEntryFormContainer 
                        registryEntry={this.props.registryEntry} 
                        registryEntryParent={this.props.registryEntryParent}
                        />
                })}
            >
                <i className="fa fa-pencil" />
                {t(this.props, 'edit.registry_entry.edit')}
            </div>
        )
    }

    show() {
        if (Object.keys(this.props.registryEntry.registry_references).length > 0 ) {

            return (
                <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'activerecord.models.registry_entries.actions.show')}
                onClick={() => this.props.openArchivePopup({
                    // title: this.props.registryEntry.name[this.props.locale],
                    content: <RegistryEntryShowContainer 
                    registryEntry={this.props.registryEntry} 
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

    ellipsis() {
        if (admin(this.props, {type: 'RegistryEntry', action: 'create'})) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'more')}
                    onClick={() => this.setState({ editButtonsVisible: !this.state.editButtonsVisible })}
                >
                    <i className="fa fa-ellipsis-v" />
                </div>
            )
        }
    }

    destroy() {
        this.props.deleteData(this.props, 'registry_entries', this.props.registryEntry.id, null, null, true);
        this.props.closeArchivePopup();
    }

    delete() {
        if (this.props.registryEntry) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'delete')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'delete'),
                    content: (
                        <div>
                            <p>{this.props.registryEntry.name[this.props.locale]}</p>
                            <div className='any-button' onClick={() => this.destroy()}>
                                {t(this.props, 'delete')}
                            </div>
                        </div>
                    )
                })}
            >
                <i className="fa fa-trash-o" />
                {t(this.props, 'delete')}
            </div>
        } else {
            return null;
        }
    }

    rmParent(parentId) {
        this.props.deleteData(this.props, 'registry_hierarchies', this.parentRegistryHierarchyId(), null, null, true);
        this.props.closeArchivePopup();
    }

    parentRegistryHierarchyId() {
        return this.props.registryEntry.parent_registry_hierarchy_ids[this.props.registryEntryParent.id];
    }

    deleteParent() {
        if (this.props.registryEntry.parent_ids[this.props.locale].length > 1) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.delete_parent')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_entry.delete_parent'),
                    content: (
                        <div>
                            <p>{this.props.registryEntryParent.name[this.props.locale]}</p>
                            <div className='any-button' onClick={() => this.rmParent()}>
                                {t(this.props, 'delete')}
                            </div>
                        </div>
                    )
                })}
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
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_entry.add_parent'),
                    content: <RegistryHierarchyFormContainer 
                                 descendantRegistryEntry={this.props.registryEntry}
                             />
                })}
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
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_entry.new'),
                    content: <RegistryEntryFormContainer 
                                registryEntryParent={this.props.registryEntry}
                            />
                })}
            >
                <i className="fa fa-sitemap" />
                {t(this.props, 'edit.registry_entry.new')}
            </div>
        )
    }

    osmLink() {
        if((this.props.registryEntry.latitude + this.props.registryEntry.longitude) !== 0 ) {
            return (
                <a 
                    href={`https://www.openstreetmap.org/?mlat=${this.props.registryEntry.latitude}&mlon=${this.props.registryEntry.longitude}&zoom=6`}
                    target="_blank"
                    rel="noopener"
                    className="flyout-sub-tabs-content-ico-link"
                    title={`${this.props.registryEntry.latitude}, ${this.props.registryEntry.longitude}`}
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
                {this.ellipsis()}
                {this.editButtons()}
            </div>
        )
    }

    editButtons() {
        if (admin(this.props, {type: 'RegistryEntry', action: 'create'})) {
            let css = this.state.editButtonsVisible ? '' : 'invisible'
            return (
                <div className={`registry-entry-edit-buttons ${css}`}>
                    <i 
                        className='fa-times fa'
                        style={{'position': 'absolute', 'color': '#8b8b7a', 'cursor': 'pointer'}}
                        onClick={() => this.setState({ editButtonsVisible: !this.state.editButtonsVisible })}></i>
                    <ul>
                        <li>{this.edit()}</li>
                        <li>{this.delete()}</li>
                        <li>{this.addRegistryEntry()}</li>
                        <li>{this.addParent()}</li>
                        <li>{this.deleteParent()} </li>
                    </ul>
                </div>
            )
        }
    }

    showChildren() {
        if (this.props.registryEntry.child_ids[this.props.locale].length > 0) {
             this.setState({ childrenVisible: !this.state.childrenVisible }) 
        }
    }

    showId() {
        if (admin(this.props, {type: 'RegistryEntry', action: 'create'})) {
            return ` (ID: ${this.props.registryEntry.id})`
        }
    }

    entry() {
        let css = this.state.childrenVisible ? 'open' : '';
        return (
            <div 
                id={`entry_${this.props.registryEntry.id}`} 
                key={"entry-" + this.props.registryEntry.id} 
                className={`registry-entry-label ${css}`}
                title={this.props.registryEntry.name[this.props.locale]}
                onClick={() => this.showChildren()}
            >
                {this.props.registryEntry.name[this.props.locale]}
                {/* {(this.props.registryEntry.child_ids[this.props.locale].length > 0) && ` (${this.props.registryEntry.child_ids[this.props.locale].length})`} */}
                {this.showId()}
            </div>
        )
    }

    children() {
        if (this.state.childrenVisible) {
            return <RegistryEntriesContainer registryEntryParent={this.props.registryEntry} />;
        } 
    }

    showHideChildren() {
        if (this.props.registryEntry.child_ids[this.props.locale].length > 0) {

            let css = this.state.childrenVisible ? 'minus-square' : 'plus-square-o';
            return (
                <div
                    className='show-hide-children'
                    title={`${this.props.registryEntry.child_ids[this.props.locale].length} ${t(this.props, 'edit.registry_entry.show_children')}`}
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
        if(this.props.registryEntry.desc !== ''){
            return (
                <div style={{color: 'grey', marginTop: '6px' }}>{this.props.registryEntry.desc}</div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.showHideChildren()}
                {this.entry()}
                {this.buttons()}
                {this.children()}
                {/* {this.description()} */}
            </div>
        )
    }
}

