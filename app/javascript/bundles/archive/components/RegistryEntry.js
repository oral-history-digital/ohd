import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import RegistryEntryFormContainer from '../containers/RegistryEntryFormContainer';
import { t, pluralize, admin } from '../../../lib/utils';

export default class RegistryEntry extends React.Component {

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
        if (this.props.refObjectType === 'interview') {
            this.props.deleteData(pluralize(this.props.refObjectType), this.props.archiveId, 'registry_references', this.props.registryReference.id);
        } else {
            this.props.deleteData('registry_references', this.props.registryReference.id, null, null, true);
        }
        this.props.closeArchivePopup();
    }

    delete() {
        if (this.props.registryReference) {
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
                </span>
            )
        }
    }

    entry() {
        let css = this.props.registryEntry.notes[this.props.locale] ? 'scope-note-link' : '';
        return (
            <span 
                id={`reference_${this.props.registryReference.id}`} 
                className={css}
                key={"reference-" + this.props.registryReference.id} 
                //onClick={() => this.setOpenReference(reference)}
            >
                {this.props.registryEntry.name[this.props.locale]}
            </span>
        )
    }

    render() {
        return (
            <span>
                {this.entry()}
                {this.buttons()}
            </span>
        )
    }
                //<p>
                    //<span className='flyout-content-label'>{t(this.props, 'activerecord.models.registry_references.one')}:</span>
                    //<span className='flyout-content-data'>{this.props.registryEntry.name[this.props.locale]}</span>
                //</p>
}

