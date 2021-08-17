import { createElement, Component } from 'react';
import {Link} from 'react-router-dom';

import { AuthorizedContent } from 'modules/auth';
import { ArchivePopupButton, PopupMenu } from 'modules/ui';
import { humanReadable } from 'modules/data';
import { pluralize, camelCase } from 'modules/strings';
import { t } from 'modules/i18n';

export default class Data extends Component {

    baseData() {
        if (this.props.showComponent) {
            return createElement(this.props.showComponent, {data: this.props.data, scope: this.props.scope });
        } else {
            return (
                <div className='base-data box'>
                    <p className='name'>{this.name()}</p>
                </div>
            )
        }
    }

    name() {
        const { data, locale } = this.props;

        return data.title || (data.name?.hasOwnProperty(locale) ? data.name[locale] : data.name);
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
                                <p className='detail' key={attribute}>
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
                <>
                    {this.props.hideShow && this.details()}
                    {this.props.form(this.props.data)}
                </>
            </ArchivePopupButton>
        )
    }

    destroy() {
        this.props.deleteData(
            this.props,
            this.props.outerScope ? pluralize(this.props.outerScope) : pluralize(this.props.scope),
            this.props.outerScopeId || this.props.data.id,
            this.props.outerScope ? pluralize(this.props.scope) : null,
            this.props.outerScope ? this.props.data.id : null,
            false
        );
        this.props.closeArchivePopup();
    }

    delete() {
        return (
            <ArchivePopupButton
                title={t(this.props, 'delete')}
                buttonFaKey='trash-o'
            >
                <>
                    <p>{this.name()}</p>
                    <div className='any-button' onClick={() => this.destroy()}>
                        {t(this.props, 'delete')}
                    </div>
                </>
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
                        type: camelCase(joined_model_name_underscore)
                    }
                }

                return (
                    <div className={`${pluralize(joined_model_name_underscore)} box`} key={`${joined_model_name_underscore}-box`}>
                        <h4 className='title'>{t(this.props, `activerecord.models.${joined_model_name_underscore}.other`)}</h4>
                        {createElement(this.props.joinedData[joined_model_name_underscore], props)}
                    </div>
                );
            });
        } else {
            return null;
        }
    }

    buttons() {
        return (
            <AuthorizedContent object={[this.props.data, this.props.task]} action='update'>
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
