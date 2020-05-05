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
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.biographical_entry.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.biographical_entry.edit'),
                    content: <BiographicalEntryFormContainer biographicalEntry={this.props.data} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </span>
        )
    }

    destroy() {
        this.props.deleteData(this.props, 'people', this.props.data.person_id, 'biographical_entries', this.props.data.id);
        this.props.closeArchivePopup();
    }

    delete() {
        return <span
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
        </span>
    }

    toggle() {
        return (
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, this.state.collapsed ? 'show' : 'hide')}
                onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            >
                <i className={`fa fa-angle-${this.state.collapsed ? 'down' : 'up'}`}></i>
            </span>
        )
    }

    buttons() {
        if (admin(this.props, {type: 'BiographicalEntry', action: 'create'})) {
            return (
                <span className={'flyout-sub-tabs-content-ico'}>
                    {this.toggle()}
                    {this.edit()}
                    {this.delete()}
                </span>
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
            <span className={'flyout-content-data'}>
                {this.props.data.text[this.props.locale].substring(0,15)}
            </span>
        )
    }

    render() {
        if (this.state.collapsed) {
            return (
                <p>
                    {this.preview()}
                    {this.buttons()}
                </p>
            )
        } else {
            return (
                <div>
                    {this.entries()}
                    {this.buttons()}
                </div>
            )
        }
    }
}

