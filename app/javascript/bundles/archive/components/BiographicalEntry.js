import React from 'react';

import BiographicalEntryFormContainer from '../containers/BiographicalEntryFormContainer';
import { t, admin } from '../../../lib/utils';

export default class BiographicalEntry extends React.Component {

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.biographical_entry.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.biographical_entry.edit'),
                    content: <BiographicalEntryFormContainer biographicalEntry={this.props.biographicalEntry} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData('people', this.props.biographicalEntry.person_id, 'biographical_entries', this.props.biographicalEntry.id);
        this.props.closeArchivePopup();
    }

    delete() {
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => this.props.openArchivePopup({
                title: `${t(this.props, 'delete')}`,
                content: (
                    <div>
                        {this.entries()}

                        <div className='any-button' onClick={() => this.destroy()}>
                            {t(this.props, 'delete')}
                        </div>
                    </div>
                )
            })}
        >
            <i className="fa fa-trash-o"></i>
        </div>
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

    entry(name) {
        return (
            <p key={name}>
                <span className='flyout-content-label'>{t(this.props, `activerecord.attributes.biographical_entry.${name}`)}:</span>
                <span className='flyout-content-data'>{this.props.biographicalEntry[name][this.props.locale]}</span>
            </p>
        )
    }

    entries() {
        return ['text', 'start_date', 'end_date'].map((entry, index) => {
            if (this.props.biographicalEntry[entry][this.props.locale]) 
                return this.entry(entry);
        })
    }

    render() {
        return (
            <div>
                {this.entries()}
                {this.buttons()}
            </div>
        )
    }
}

