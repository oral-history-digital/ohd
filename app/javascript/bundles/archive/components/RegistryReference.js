import React from 'react';
import RegistryEntryFormContainer from '../containers/RegistryEntryFormContainer';
import { t, pluralize, admin } from '../../../lib/utils';

export default class RegistryReference extends React.Component {

    edit() {
        if (
            this.props.registryEntry &&
            !this.props.hideEdit &&
            admin(this.props, this.props.registryEntry)
        ) {
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
        } else {
            return null;
        }
    }

    destroy() {
        if (this.props.refObjectType === 'interview') {
            this.props.deleteData(pluralize(this.props.refObjectType), this.props.archiveId, 'registry_references', this.props.registryReference.id);
        } else {
            this.props.deleteData('registry_references', this.props.registryReference.id, null, null, true);
        }
        this.props.closeArchivePopup();
    }

    delete() {
        if (
            this.props.registryReference &&
            !this.props.hideEdit &&
            admin(this.props, this.props.registryReference)
        ) {
            return <div
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
            </div>
        } else {
            return null;
        }
    }

    buttons() {
        return (
            <span className={'flyout-sub-tabs-content-ico'}>
                {/* {this.edit()} */}
                {this.delete()}
            </span>
        )
    }

    entry() {
        let css = this.props.registryEntry.notes[this.props.locale] ? 'scope-note-link' : '';
        return (
            <span 
                id={`reference_${this.props.registryReference.id}`} 
                className={css}
                key={"reference-" + this.props.registryReference.id} 
                onClick={() => this.props.project === 'mog' && this.props.setOpenReference(this.props.registryEntry)}
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

