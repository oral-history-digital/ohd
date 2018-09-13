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
            this.props.fetchData('registry_entries', this.props.registryEntry.id);
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
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData('registry_entries', this.props.registryEntry.id, null, null, true);
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
                <div className={'flyout-sub-tabs-content-ico'}>
                    {this.edit()}
                    {this.delete()}
                </div>
            )
        }
    }

    entry() {
        return (
            <div 
                id={`entry_${this.props.registryEntry.id}`} 
                key={"entry-" + this.props.registryEntry.id} 
                className={'registry-entry-label'}
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
        let css = this.state.childrenVisible ? 'minus-square' : 'plus-square-o';
        return (
            <div
                className='show-hide-children'
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
                {this.showHideChildren()}
                {this.entry()}
                {this.buttons()}
                {this.children()}
            </div>
        )
    }
}

