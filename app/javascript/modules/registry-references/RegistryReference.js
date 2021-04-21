import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'modules/ui';
import { pluralize, underscore } from 'modules/strings';
import { admin } from 'modules/auth'
import { t } from 'modules/i18n';
import RegistryReferenceFormContainer from './RegistryReferenceFormContainer';

export default class RegistryReference extends React.Component {
    componentDidMount() {
        this.loadRegistryEntry(this.props.registryReference.registry_entry_id);
    }

    componentDidUpdate() {
        this.loadRegistryEntry(this.props.registryReference.registry_entry_id);
    }

    loadRegistryEntry(id) {
        if (
            id &&
            (
                !this.props.registryEntriesStatus[id] ||
                this.props.registryEntriesStatus[id] !== 'fetching'
            ) && (
                !this.props.registryEntries[id] ||
                (
                    this.props.registryEntries[id] &&
                    !this.props.registryEntries[id].associations_loaded
                )
            )
        ) {
            this.props.fetchData(this.props, 'registry_entries', id, null, 'with_associations=true');
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
                <Modal
                    title={t(this.props, 'edit.registry_reference.edit')}
                    trigger={<i className="fa fa-pencil"/>}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <RegistryReferenceFormContainer
                            registryReference={this.props.registryReference}
                            lowestAllowedRegistryEntryId={this.props.lowestAllowedRegistryEntryId}
                            inTranscript={this.props.inTranscript}
                            registryReferenceTypeId={this.props.registryReferenceTypeId}
                            locale={this.props.locale}
                            goDeeper={true}
                            onSubmit={close}
                        />
                    )}
                </Modal>
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
    }

    delete() {
        if (
            this.props.registryReference &&
            !this.props.hideEdit &&
            admin(this.props, this.props.registryReference)
        ) {
            return (
                <Modal
                    title={t(this.props, 'edit.registry_reference.delete')}
                    trigger={<i className="fa fa-trash-o"/>}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <div>
                            <p>{this.props.registryEntry.name[this.props.locale]}</p>
                            <button
                                type="button"
                                className='any-button'
                                onClick={() => {
                                    this.destroy();
                                    close();
                                }}
                            >
                                {t(this.props, 'edit.registry_reference.delete')}
                            </button>
                        </div>
                    )}
                </Modal>
            );
        } else {
            return null;
        }
    }

    buttons() {
        return (
            <span className="RegistryReference-buttons flyout-sub-tabs-content-ico">
                {this.edit()}
                {this.delete()}
            </span>
        )
    }

    entry() {
        const { registryEntry, registryReference, locale, setOpenReference } = this.props;

        const hasNote = !!registryEntry.notes[locale];

        return (
            hasNote ? (
                <button
                    type="button"
                    id={"reference-" + registryReference.id}
                    className="RegistryReference-name RegistryReference-name--link"
                    onClick={() => setOpenReference(registryEntry)}
                >
                    {registryEntry.name[locale]}
                </button>
            ) : (
                <span
                    id={"reference-" + registryReference.id}
                    className="RegistryReference-name"
                >
                    {registryEntry.name[locale]}
                </span>
            )
        );
    }

    render() {
        return (
            <li className="RegistryReference registry-reference">
                {this.entry()}
                {this.buttons()}
            </li>
        )
    }
}

RegistryReference.propTypes = {
    locale: PropTypes.string.isRequired,
    hideEdit: PropTypes.bool,
    inTranscript: PropTypes.bool,
    lowestAllowedRegistryEntryId: PropTypes.number,
    registryReferenceTypeId: PropTypes.number,
    registryReference: PropTypes.object.isRequired,
    registryEntry: PropTypes.object,
    refObject: PropTypes.object,
    registryEntries: PropTypes.object.isRequired,
    registryEntriesStatus: PropTypes.object.isRequired,
    setOpenReference: PropTypes.func,
    deleteData: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
