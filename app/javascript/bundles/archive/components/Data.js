import React from 'react';
import {Link} from 'react-router-dom';

import PopupMenu from './PopupMenu';
import AuthorizedContent from './AuthorizedContent';
import { ArchivePopupButton } from 'modules/ui';

import TaskPreviewContainer from '../containers/TaskPreviewContainer';

import { pluralize, camelcase, humanReadable } from 'lib/utils';
import { t } from 'modules/i18n';

export default class Data extends React.Component {

    baseData() {
        if (this.props.data.type === 'Task') {
            return <TaskPreviewContainer data={this.props.data} scope={this.props.scope} />
        } else if (this.props.data.archive_domain) {
            return (
                <Link
                    onClick={() => this.props.setProjectId(this.props.data.identifier)}
                    to={`/${this.props.data.identifier}/${this.props.locale}/`}
                >
                    {this.props.data.name[this.props.locale]}
                </Link>
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
        return this.props.data.title || (this.props.data.name?.hasOwnProperty(this.props.locale) ? this.props.data.name[this.props.locale] : this.props.data.name);
    }

    details() {
        return (
            <div className='details'>
                {
                    this.props.detailsAttributes.map((attribute, index) => {
                        if (attribute === 'src') {
                            return <img src={ this.props.data.src } />
                        } else {
                            return (
                                <p className='detail'>
                                    <span className='name'>{t(this.props, `activerecord.attributes.${this.props.scope}.${attribute}`) + ': '}</span>
                                    <span className='content'>{humanReadable(this.props.data, attribute, this.props, {})}</span>
                                </p>
                            )
                        }
                    })
                }
            </div>
        )
    }

    show() {
        return (
            <ArchivePopupButton
                title={this.name()}
                buttonFaKey='eye'
            >
                {this.details()}
            </ArchivePopupButton>
        )
    }

    edit() {
        return (
            <ArchivePopupButton
                title={`${this.name()} ${t(this.props, `edit.${this.props.scope}.edit`)}`}
                buttonFaKey='pencil'
            >
                {this.props.hideShow && this.details()}
                {this.props.form(this.props.data)}
            </ArchivePopupButton>
        )
    }

    destroy() {
        this.props.deleteData(this.props, pluralize(this.props.scope), this.props.data.id, null, null, false);
        this.props.closeArchivePopup();
    }

    delete() {
        return (
            <ArchivePopupButton
                title={t(this.props, 'delete')}
                buttonFaKey='trash-o'
            >
                <p>{this.name()}</p>
                <div className='any-button' onClick={() => this.destroy()}>
                    {t(this.props, 'delete')}
                </div>
            </ArchivePopupButton>
        )
    }

    joinedData() {
        if (this.props.joinedData) {
            return Object.keys(this.props.joinedData).map((joined_model_name_underscore, index) => {
                let props = {
                    data: this.props.data[pluralize(joined_model_name_underscore)],
                    task: this.props.data.type === 'Task' && this.props.data,
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
        return (
            <AuthorizedContent object={[this.props.data, this.props.task]}>
                <PopupMenu>
                    <PopupMenu.Item>{!this.props.hideShow && this.show()}</PopupMenu.Item>
                    <PopupMenu.Item>{!this.props.hideEdit && this.edit()}</PopupMenu.Item>
                    <PopupMenu.Item>{!this.props.hideDelete && this.delete()}</PopupMenu.Item>
                </PopupMenu>
            </AuthorizedContent>
        );
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
