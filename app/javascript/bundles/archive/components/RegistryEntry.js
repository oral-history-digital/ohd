import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import RegistryEntryFormContainer from '../containers/RegistryEntryFormContainer';
import RegistryEntriesContainer from '../containers/RegistryEntriesContainer';
import { t, pluralize, admin } from '../../../lib/utils';

export default class RegistryEntry extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {childrenVisible: false};
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_entry.edit'),
                    content: <RegistryEntryFormContainer registryEntry={this.props.registryEntry} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData('registry_entries', this.props.registryEntry.id);
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
                <i className="fa fa-trash-o"></i>
            </div>
        } else {
            return null;
        }
    }

    buttons() {
        if (admin(this.props)) {
            return (
                <span className={'flyout-sub-tabs-content-ico'}>
                    {this.edit()}
                    {this.delete()}
                    {this.showHideChildren()}
                </span>
            )
        }
    }

    entry() {
        return (
            <div 
                id={`entry_${this.props.registryEntry.id}`} 
                key={"entry-" + this.props.registryEntry.id} 
            >
                {this.props.registryEntry.name[this.props.locale]}
            </div>
        )
    }

    children() {
        if (this.state.childrenVisible) {
            return <RegistryEntriesContainer registryEntryParent={this.props.registryEntry} />;
        } 
    }

    showHideChildren() {
        let css = this.state.childrenVisible ? 'minus' : 'plus';
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry.show_children')}
                onClick={() => this.setState({ childrenVisible: !this.state.childrenVisible })}
            >
                <i className={`fa fa-${css}`}></i>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.entry()}
                {this.buttons()}
                {this.children()}
            </div>
        )
    }
}

