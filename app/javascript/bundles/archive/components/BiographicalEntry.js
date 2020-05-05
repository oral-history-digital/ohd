import React from 'react';

import BiographicalEntryFormContainer from '../containers/BiographicalEntryFormContainer';
import { t, admin } from '../../../lib/utils';

export default class BiographicalEntry extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            collapsed: true
        }
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.biographical_entry.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.biographical_entry.edit'),
                    content: <BiographicalEntryFormContainer biographicalEntry={this.props.data} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData(this.props, 'people', this.props.data.person_id, 'biographical_entries', this.props.data.id);
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

    toggle() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, this.state.collapsed ? 'show' : 'hide')}
                onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            >
                <i className={`fa fa-angle-${this.state.collapsed ? 'down' : 'up'}`}></i>
            </div>
        )
    }

    buttons() {
        if (admin(this.props, {type: 'BiographicalEntry', action: 'create'})) {
            return (
                <div className={'flyout-sub-tabs-content-ico'}>
                    {this.toggle()}
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
                <span className='flyout-content-data' dangerouslySetInnerHTML={{__html: this.props.data[name][this.props.locale]}} />
            </p>
        )
    }

    entries() {
        return ['text', 'start_date', 'end_date'].map((entry, index) => {
            if (this.props.data[entry][this.props.locale]) 
                return this.entry(entry);
        })
    }

    preview() {
        return (
            <div className={'flyout-sub-tabs-content-ico'}>
                {this.props.data.text[this.props.locale].substring(0,15)}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.collapsed ? this.preview() : this.entries()}
                {this.buttons()}
            </div>
        )
    }
}

