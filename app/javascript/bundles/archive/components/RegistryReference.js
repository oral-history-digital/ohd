import React from 'react';
import RegistryReferenceFormContainer from '../containers/RegistryReferenceFormContainer';
import { t, pluralize, underscore, admin } from '../../../lib/utils';

export default class RegistryReference extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.loadRegistryEntry();
    }

    componentDidUpdate() {
        this.loadRegistryEntry();
    }

    loadRegistryEntry() {
        if (
            (
                !this.props.registryEntriesStatus[this.props.registryReference.registry_entry_id] ||
                this.props.registryEntriesStatus[this.props.registryReference.registry_entry_id] !== 'fetching'
            ) && (
                !this.props.registryEntries[this.props.registryReference.registry_entry_id] ||
                (
                    this.props.registryEntries[this.props.registryReference.registry_entry_id] &&
                    !this.props.registryEntries[this.props.registryReference.registry_entry_id].associations_loaded
                )
            )
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.registryReference.registry_entry_id, null, 'with_associations=true');
        }
    }

    edit() {
        if (
            this.props.registryReference &&
            !this.props.hideEdit &&
            admin(this.props, this.props.registryReference) &&
            this.props.registryEntries[this.props.registryReference.registry_entry_id] &&
            this.props.registryEntries[this.props.registryReference.registry_entry_id].associations_loaded
        ) {
            return (
                <span
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.registry_entry.edit')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.edit'),
                        content: (
                            <RegistryReferenceFormContainer 
                                registryReference={this.props.registryReference} 
                                locale={this.props.locale} 
                                parentEntryId={this.props.registryEntries[this.props.registryReference.registry_entry_id].parent_ids[this.props.locale][0]}
                            />
                        )
                    })}
                >
                    <i className="fa fa-pencil"></i>
                </span>
            )
        } else {
            return null;
        }
    }

    destroy() {
        if (this.props.refObject.type === 'Segment') {
            this.props.deleteData(this.props, 'registry_references', this.props.registryReference.id, null, null, true);
        } else {
            // refObject.type === Person || Interview
            this.props.deleteData(
                this.props, pluralize(underscore(this.props.refObject.type)), 
                this.props.refObject.archiveId || this.props.refObject.archive_id || this.props.refObject.id, 
                'registry_references', 
                this.props.registryReference.id
            );
        }
        this.props.closeArchivePopup();
    }

    delete() {
        if (
            this.props.registryReference &&
            !this.props.hideEdit &&
            admin(this.props, this.props.registryReference)
        ) {
            return <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_reference.delete')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_reference.delete'),
                    content: (
                        <div>
                            <p>{this.props.registryEntry.name[this.props.locale]}</p>
                            <div className='any-button' onClick={() => this.destroy()}>
                                {t(this.props, 'edit.registry_reference.delete')}
                            </div>
                        </div>
                    )
                })}
            >
                <i className="fa fa-trash-o"></i>
            </span>
        } else {
            return null;
        }
    }

    buttons() {
        return (
            <span className={'flyout-sub-tabs-content-ico'}>
                {this.edit()}
                {this.delete()}
            </span>
        )
    }

    entry() {
        let hasNote = !!this.props.registryEntry.notes[this.props.locale]
        let css = hasNote ? 'scope-note-link' : '';
        return (
            <span 
                id={`reference_${this.props.registryReference.id}`} 
                className={css}
                key={"reference-" + this.props.registryReference.id} 
                onClick={() => hasNote && this.props.setOpenReference(this.props.registryEntry)}
            >
                {this.props.registryEntry.name[this.props.locale]}
            </span>
        )
    }

    render() {
        return (
            <span className={'registry-reference'}>
                {this.entry()}
                {this.buttons()}
            </span>
        )
    }
}

