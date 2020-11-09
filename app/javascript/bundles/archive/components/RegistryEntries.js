import React from 'react';

import RegistryEntryContainer from '../containers/RegistryEntryContainer';
import RegistryEntryFormContainer from '../containers/RegistryEntryFormContainer';
import { t, admin } from '../../../lib/utils';
import PixelLoader from '../../../lib/PixelLoader'

export default class RegistryEntries extends React.Component {

    constructor(props, context) {
        super(props, context);
        //this.state = {registryEntryParent: this.props.registryEntryParent};
    }

    componentDidMount() {
        this.loadWithAssociations();
        this.loadRegistryEntries();
    }

    componentDidUpdate() {
        this.loadWithAssociations();
        this.loadRegistryEntries();
    }

    loadWithAssociations() {
        if (
            this.props.registryEntryParent && 
            !this.props.registryEntryParent.associations_loaded &&
            this.props.registryEntriesStatus[this.props.registryEntryParent.id] !== 'fetching'
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.registryEntryParent.id, null, 'with_associations=true');
        }
    }

    loadRegistryEntries() {
        if (
            this.props.projectId &&
            this.props.registryEntryParent &&
            this.props.registryEntryParent.associations_loaded &&
            !this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`]
        ) {
            this.props.fetchData(this.props, 'registry_entries', null, null, `children_for_entry=${this.props.registryEntryParent.id}`);
        }
    }

    hideRegistryEntry(id) {
        if (this.props.project.hidden_registry_entry_ids && this.props.project.hidden_registry_entry_ids.indexOf(id.toString()) !== -1 && !admin(this.props, {type: 'RegistryEntry', action: 'update'})) {
            return true;
        }
        else {
            return false;
        }
    }

    registryEntries() {
        if (
            this.props.registryEntryParent &&
            this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`] && 
            this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`].split('-')[0] === 'fetched' &&
            this.props.registryEntryParent.associations_loaded
        ) {
            return this.props.registryEntryParent.child_ids[this.props.locale].map((id, index) => {
                let registryEntry = this.props.registryEntries[id] 
                if (registryEntry && !this.hideRegistryEntry(id)) {
                    return (
                        <li key={`registry_entries-li-${id}`}>
                            <RegistryEntryContainer 
                                data={registryEntry} 
                                key={`registry_entries-${id}`} 
                                registryEntryParent={this.props.registryEntryParent}
                            />
                        </li>
                    )
                }
            })
        } else {
            return <li><PixelLoader /></li>
        }
    }

    addRegistryEntry() {
        if (admin(this.props, {type: 'RegistryEntry', action: 'create'})) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.registry_entry.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.new'),
                        content: <RegistryEntryFormContainer 
                                    registryEntryParent={this.props.registryEntryParent}
                                />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <ul className={'registry-entries-ul'}>
                    {this.registryEntries()}
                </ul>
                {this.addRegistryEntry()}
            </div>
        )
    }
}

