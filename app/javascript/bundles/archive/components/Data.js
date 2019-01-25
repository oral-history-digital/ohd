import React from 'react';

import { t, admin, pluralize } from '../../../lib/utils';

export default class Data extends React.Component {

    baseData() {
        return (
            <div className='base-data box'>
                <p className='name'>{this.props.data.name}</p>
            </div>
        )
                //<p className='created-at'>
                    //<span className='title'>{t(this.props, `activerecord.attributes.${this.props.scope}.created_at`) + ': '}</span>
                    //<span className='content'>{this.props.data.created_at}</span>
                //</p>
    }

    details() {
        return (
            <div className='details'>
                {
                    this.props.detailsAttributes.map((detail, index) => {
                        return (
                            <p className='detail'>
                                <span className='name'>{t(this.props, `activerecord.attributes.${this.props.scope}.${detail}`) + ': '}</span>
                                <span className='content'>{this.props.data[detail]}</span>
                            </p>
                        )
                    })
                }
            </div>
        )
    }

    show() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, `edit.${this.props.scope}.show`)}
                onClick={() => this.props.openArchivePopup({
                    title: this.props.data.name || this.props.data.title,
                    content: this.details()
                })}
            >
                <i className="fa fa-eye"></i>
            </div>
        )
    }

    edit() {
        if (!this.props.hideEdit) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, `edit.${this.props.scope}.edit`)}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, `edit.${this.props.scope}.edit`),
                        content: this.props.form(this.props.data)
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
        this.props.deleteData(pluralize(this.props.scope), this.props.data.id, null, null, true);
        this.props.closeArchivePopup();
    }

    delete() {
        if (this.props.data) {
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
        } else {
            return null;
        }
    }

    joinedData() {
        if (this.props.joinedData) {
            return Object.keys(this.props.joinedData).map((joined_model_name_underscore, index) => {
                let props = {
                    data: this.props.data[pluralize(joined_model_name_underscore)], 
                    initialFormValues: {[`${this.props.scope}_id`]: this.props.data.id}
                }
                return (
                    <div className={`${pluralize(joined_model_name_underscore)} box`}>
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
        if (admin(this.props)) {
            return (
                <div className={'buttons box'}>
                    {this.show()}
                    {this.edit()}
                    {this.delete()}
                </div>
            )
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

