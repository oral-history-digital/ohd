import React from 'react';

import RegistryReferenceFormContainer from '../containers/RegistryReferenceFormContainer';
import RegistryReferenceContainer from '../containers/RegistryReferenceContainer';
import AuthorizedContent from './AuthorizedContent';
import { t } from 'lib/utils';

export default class RegistryReferences extends React.Component {
    componentDidMount() {
        this.loadRegistryEntries();
        this.loadRootRegistryEntry();
    }

    componentDidUpdate() {
        this.loadRegistryEntries();
        this.loadRootRegistryEntry();
    }

    loadRegistryEntries() {
        if (!this.props.registryEntriesStatus[`ref_object_type_${this.props.refObject.type}_ref_object_id_${this.props.refObject.id}`]) {
            this.props.fetchData(this.props, 'registry_entries', null, null, `ref_object_type=${this.props.refObject.type}&ref_object_id=${this.props.refObject.id}`);
        }
    }

    loadRootRegistryEntry() {
        // TODO: fit this for MOG - id of root entry will be different
        if (
            !this.props.registryEntriesStatus[1] ||
            this.props.registryEntriesStatus[1].split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'registry_entries', 1);
        }
    }

    registryReferences() {
        let registryReferences = [];

        // only show registryEntries once, even if they have multiple references
        let usedRegistryEntryIds = [];

        if (
            this.props.refObject &&
            this.props.registryEntriesStatus[`ref_object_type_${this.props.refObject.type}_ref_object_id_${this.props.refObject.id}`] &&
            this.props.registryEntriesStatus[`ref_object_type_${this.props.refObject.type}_ref_object_id_${this.props.refObject.id}`].split('-')[0] === 'fetched'
        ) {
            for (var c in this.props.refObject.registry_references) {

                let registryReference = this.props.refObject.registry_references[c];
                let registryEntry = this.props.registryEntries[registryReference.registry_entry_id];

                if (
                    registryEntry &&
                    registryEntry.name[this.props.locale] &&
                    usedRegistryEntryIds.indexOf(registryEntry.id) === -1 &&
                    (
                        // select on this.props.registryReferenceTypeId only if defined
                        (this.props.registryReferenceTypeId && (this.props.registryReferenceTypeId === registryReference.registry_reference_type_id)) ||
                        !this.props.registryReferenceTypeId
                    )
                ) {
                    registryReferences.push(
                        <RegistryReferenceContainer
                            registryEntry={registryEntry}
                            registryReference={registryReference}
                            registryReferenceTypeId={this.props.registryReferenceTypeId}
                            refObject={this.props.refObject}
                            lowestAllowedRegistryEntryId={this.props.lowestAllowedRegistryEntryId}
                            inTranscript={this.props.inTranscript}
                            locale={this.props.locale}
                            key={`registry_reference-${registryReference.id}`}
                            setOpenReference={this.props.setOpenReference}
                        />
                    );
                    usedRegistryEntryIds.push(registryEntry.id);
                }
            }

            return registryReferences.length > 0 && (
                <ul className="RegistryReferences-list">
                    {registryReferences}
                </ul>
            );
        }
    }

    addRegistryReference() {
        // TODO: fit this for MOG - id of root entry will be different
        if (this.props.registryEntriesStatus[1] && this.props.registryEntriesStatus[1].split('-')[0] === 'fetched') {
            return (
                <AuthorizedContent object={{type: 'RegistryReference', action: 'create', interview_id: this.props.interview.id}}>
                    <button
                        type="button"
                        className="RegistryReferences-addButton"
                        title={t(this.props, 'edit.registry_reference.new')}
                        onClick={() => this.props.openArchivePopup({
                            title: t(this.props, 'edit.registry_reference.new'),
                            content: <RegistryReferenceFormContainer
                                        refObject={this.props.refObject}
                                        interview={this.props.interview}
                                        lowestAllowedRegistryEntryId={this.props.lowestAllowedRegistryEntryId}
                                        inTranscript={this.props.inTranscript}
                                        registryReferenceTypeId={this.props.registryReferenceTypeId}
                                        locale={this.props.locale}
                                        goDeeper={true}
                                    />
                        })}
                    >
                        <i className="fa fa-plus"></i>
                    </button>
                </AuthorizedContent>
            );
        }
    }

    render() {
        return (
            <>
                {this.registryReferences()}
                {this.addRegistryReference()}
            </>
        )
    }
}
