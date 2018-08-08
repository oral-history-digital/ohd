import React from 'react';

import RegistryReferenceFormContainer from '../containers/RegistryReferenceFormContainer';
import RegistryEntryContainer from '../containers/RegistryEntryContainer';
import { t, admin } from '../../../lib/utils';

export default class SegmentRegistryReferences extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.loadRegistryEntries();
    }

    componentDidUpdate() {
        this.loadRegistryEntries();
    }

    loadRegistryEntries() {
        if (!this.props.registryEntriesStatus[`references_for_segment_${this.props.segment.id}`]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `references_for_segment=${this.props.segment.id}`);
        }
    }

    registryEntries() {
        let registryEntries = [];
        if (
            this.props.segment && 
            this.props.registryEntriesStatus[`references_for_segment_${this.props.segment.id}`] &&
            this.props.registryEntriesStatus[`references_for_segment_${this.props.segment.id}`].split('-')[0] === 'fetched'
        ) {
            for (var c in this.props.segment.registry_references) {
                let registryReference = this.props.segment.registry_references[c];
                let registryEntry = this.props.registryEntries[registryReference.registry_entry_id];
                if (registryEntry && registryReference !== 'fetched') {
                    registryEntries.push(
                        <RegistryEntryContainer 
                            registryEntry={registryEntry} 
                            registryReference={registryReference} 
                            refObjectType='segment'
                            key={`registry_reference-${registryReference.id}`} 
                        />
                    );
                }
            }
        } 
        return registryEntries;
    }

    addRegistryReference() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_reference.new')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_reference.new'),
                    content: <RegistryReferenceFormContainer 
                                 refObject={this.props.segment} 
                                 refObjectType='Segment' 
                                 interview={this.props.interview} 
                                 registryEntryParent={this.props.rootRegistryEntry}
                                 goDeeper={true}
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
                {this.registryEntries()}
                {this.addRegistryReference()}
            </div>
        )
    }
}

