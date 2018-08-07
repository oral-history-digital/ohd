import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import RegistryEntryFormContainer from '../containers/RegistryEntryFormContainer';
import { t, pluralize, admin } from '../../../lib/utils';

export default class RegistryEntry extends React.Component {

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.registry_entry')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.registry_entry'),
                    content: <RegistryEntryFormContainer registryEntry={this.props.registryEntry} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData(pluralize(this.props.refObjectType), this.props.archiveId, 'registry_references', this.props.registryReference.id);
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
                <div className={'flyout-sub-tabs-content-ico'}>
                    {this.edit()}
                    {this.delete()}
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <p>
                    <span className='flyout-content-label'>{t(this.props, 'activerecord.models.registry_references.one')}:</span>
                    <span className='flyout-content-data'>{this.props.registryEntry.name[this.props.locale]}</span>
                </p>
                {this.buttons()}
            </div>
        )
    }
}

