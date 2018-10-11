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
        this.loadRegistryEntries();
    }

    componentDidUpdate() {
        this.loadRegistryEntries();
    }

    loadRegistryEntries() {
        if (
            this.props.registryEntryParent &&
            !this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`]
        ) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `children_for_entry=${this.props.registryEntryParent.id}`);
        }
    }

    registryEntries() {
        if (
            this.props.registryEntryParent &&
            this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`] && 
            this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`].split('-')[0] === 'fetched'
        ) {
            return this.props.registryEntryParent.child_ids.map((id, index) => {
                let registryEntry = this.props.registryEntries[id] 
                if (registryEntry) {
                    return (
                        <li key={`registry_entries-li-${id}`}>
                            <RegistryEntryContainer 
                                registryEntry={registryEntry} 
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

