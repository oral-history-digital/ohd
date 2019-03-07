import React from 'react';

import RegistryReferenceFormContainer from '../containers/RegistryReferenceFormContainer';
import RegistryReferenceContainer from '../containers/RegistryReferenceContainer';
import { t, admin } from '../../../lib/utils';

export default class SegmentRegistryReferences extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.loadRegistryEntries();
        this.loadRootRegistryEntry();
    }

    componentDidUpdate() {
        this.loadRegistryEntries();
        this.loadRootRegistryEntry();
    }

    loadRegistryEntries() {
        if (!this.props.registryEntriesStatus[`references_for_segment_${this.props.segment.id}`]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `references_for_segment=${this.props.segment.id}`);
        }
    }

    loadRootRegistryEntry() {
        // TODO: fit this for MOG - id of root entry will be different
        if (
            !this.props.registryEntriesStatus[1] || 
            this.props.registryEntriesStatus[1].split('-')[0] === 'reload'
        ) {
            this.props.fetchData('registry_entries', 1);
        }
    }

    registryReferences() {
        let registryReferences = [];
        if (
            this.props.segment && 
            this.props.registryEntriesStatus[`references_for_segment_${this.props.segment.id}`] &&
            this.props.registryEntriesStatus[`references_for_segment_${this.props.segment.id}`].split('-')[0] === 'fetched'
        ) {
            for (var c in this.props.segment.registry_references) {
                let registryReference = this.props.segment.registry_references[c];
                let registryEntry = this.props.registryEntries[registryReference.registry_entry_id];
                if (registryEntry && registryReference !== 'fetched') {
                    registryReferences.push(
                        <RegistryReferenceContainer 
                            registryEntry={registryEntry} 
                            registryReference={registryReference} 
                            refObjectType='segment'
                            locale={this.props.locale}
                            key={`registry_reference-${registryReference.id}`} 
                            setOpenReference={this.props.setOpenReference}
                        />
                    );
                }
            }
        } 
        return registryReferences;
    }

    addRegistryReference() {
        // TODO: fit this for MOG - id of root entry will be different
        if (admin(this.props, {type: 'RegistryReference', action: 'create'}) && this.props.registryEntriesStatus[1] && this.props.registryEntriesStatus[1].split('-')[0] === 'fetched') {
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
                                     parentEntryId={1}
                                     locale={this.props.locale}
                                     goDeeper={true}
                                 />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                {this.registryReferences()}
                {this.addRegistryReference()}
            </div>
        )
    }
}

