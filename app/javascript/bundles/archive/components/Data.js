import React from 'react';
import {Link} from 'react-router-dom';

import PopupMenu from './PopupMenu';
import { t, admin, pluralize, camelcase, pathBase } from '../../../lib/utils';

export default class Data extends React.Component {

    baseData() {
        if (this.props.data.type === 'Task') {
            let dateAttribute;
            if (this.props.data.user_account_id === this.props.account.id) {
                // tasks assigned to current user
                if (this.props.data.workflow_state === 'finished') {
                    dateAttribute = 'finished_at';
                } else {
                    dateAttribute = 'assigned_to_user_account_at';
                }
            } else if (this.props.data.supervisor_id === this.props.account.id) {
                // tasks assigned to current user as QM
                if (this.props.data.workflow_state === 'cleared') {
                    dateAttribute = 'cleared_at';
                } else {
                    dateAttribute = 'assigned_to_supervisor_at';
                }
            }
            return (
                <div className='base-data box'>
                    <p>
                        <Link
                            onClick={() => {
                                this.props.setArchiveId(this.props.data.archive_id);
                                this.props.setTapeAndTime(1, 0)
                            }}
                            to={pathBase(this.props) + '/interviews/' + this.props.data.archive_id}
                        >
                            {`${this.props.data.archive_id}: ${this.name()}`}
                        </Link>
                    </p>
                    <p className='created-at'>
                        <span className='title'>{t(this.props, `activerecord.attributes.${this.props.scope}.${dateAttribute}`) + ': '}</span>
                        <span className='content'>{this.props.data[dateAttribute]}</span>
                    </p>
                </div>
            )
        } else if (this.props.data.type === 'Project') {
            return (
                <div className='base-data box'>
                    <Link to={pathBase(this.props)} >
                        {this.props.data.name[this.props.locale]}
                    </Link>
                </div>
            )
        } else {
            return (
                <div className='base-data box'>
                    <p className='name'>{this.name()}</p>
                </div>
            )
        }
    }

    name() {
        return this.props.data.title || (this.props.data.name && this.props.data.name.hasOwnProperty(this.props.locale) ? this.props.data.name[this.props.locale] : this.props.data.name);
    }

    values(detail) {
        if (
            this.props.data &&
            this.props.data[detail] !== null &&
            typeof(this.props.data[detail]) === 'object' &&
            Object.keys(this.props.data[detail]).indexOf(this.props.locale) !== -1
        ) {
            return this.props.data[detail][this.props.locale];
        } else {
            let value = this.props.data[detail];
            if (detail === 'workflow_state' && this.props.translations[this.props.locale]['workflow_states'].hasOwnProperty(value))
                value = t(this.props, `workflow_states.${value}`);

            return value || '---';
        }
    }

    details() {
        return (
            <div className='details'>
                {
                    this.props.detailsAttributes.map((detail, index) => {
                        if (detail === 'src') {
                            return <img src={ this.props.data.src } />
                        } else {
                            return (
                                <p className='detail'>
                                    <span className='name'>{t(this.props, `activerecord.attributes.${this.props.scope}.${detail}`) + ': '}</span>
                                    <span className='content'>{this.values(detail)}</span>
                                </p>
                            )
                        }
                    })
                }
            </div>
        )
    }

    show() {
        if (
            !this.props.hideShow
        ) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, `edit.${this.props.scope}.show`)}
                    onClick={() => this.props.openArchivePopup({
                        title: this.name(),
                        content: this.details()
                    })}
                >
                    <i className="fa fa-eye"></i>
                </div>
            )
        }
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, `edit.${this.props.scope}.edit`)}
                onClick={() => this.props.openArchivePopup({
                    title: `${this.name()} ${t(this.props, `edit.${this.props.scope}.edit`)}`,
                    content: (
                        <div>
                            {this.props.hideShow && this.details()}
                            {this.props.form(this.props.data)}
                        </div>
                    )
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData(this.props, pluralize(this.props.scope), this.props.data.id, null, null, false);
        this.props.closeArchivePopup();
    }

    delete() {
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => this.props.openArchivePopup({
                title: t(this.props, 'delete'),
                content: (
                    <div>
                        <p>{this.props.data.name[this.props.locale] || this.props.data.name}</p>
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

    joinedData() {
        if (this.props.joinedData) {
            return Object.keys(this.props.joinedData).map((joined_model_name_underscore, index) => {
                let props = {
                    data: this.props.data[pluralize(joined_model_name_underscore)],
                    initialFormValues: {
                        [`${this.props.scope}_id`]: this.props.data.id,
                        //
                        // the following could be generalized better
                        // at the moment it is ment to get the polymorphic association 'ref'
                        // and multiple possible types of uploaded_file into the form
                        //
                        ref_id: this.props.data.id,
                        ref_type: this.props.data.type,
                        type: camelcase(joined_model_name_underscore)
                    }
                }
                return (
                    <div className={`${pluralize(joined_model_name_underscore)} box`} key={`${joined_model_name_underscore}-box`}>
                        <h4 className='title'>{t(this.props, `activerecord.models.${joined_model_name_underscore}.other`)}</h4>
                        {React.createElement(this.props.joinedData[joined_model_name_underscore], props)}
                    </div>
                )
            })
        } else {
            return null;
        }
    }

    buttons() {
        if (
            admin(this.props, this.props.data) ||
            // allow commenting onn task
            this.props.task && admin(this.props, this.props.task)
        ) {
            return (
                <PopupMenu>
                    <PopupMenu.Item>{this.show()}</PopupMenu.Item>
                    <PopupMenu.Item>{!this.props.hideEdit && this.edit()}</PopupMenu.Item>
                    <PopupMenu.Item>{!this.props.hideDelete && this.delete()}</PopupMenu.Item>
                </PopupMenu>
            );
        }
    }

    render() {
        if (this.props.data) {
            return (
                <div className='data boxes'>
                    {this.baseData()}
                    {this.buttons()}
                    {this.joinedData()}
                </div>
            )
        } else {
            return null;
        }
    }
}
