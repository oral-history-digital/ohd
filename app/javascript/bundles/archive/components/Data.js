import React from 'react';

import { t, admin, pluraliize } from '../../../lib/utils';

export default class Data extends React.Component {

    baseData() {
        return (
            <div className='base-data box'>
                <p className='name'>{this.props.data.name}</p>
                <p className='created-at'>
                    <span className='title'>{t(this.props, `activerecord.attributes.${this.props.scope}.created_at`) + ': '}</span>
                    <span className='content'>{this.props.data.created_at}</span>
                </p>
            </div>
        )
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
                title={t(this.props, 'edit.data.show')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.data.show'),
                    content: this.details()
                })}
            >
                <i className="fa fa-eye"></i>
            </div>
        )
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.data.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.data.edit'),
                    content: this.props.form(this.props.data)
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData(pluralize(this.props.scope), this.props.registryEntry.id, null, null, true);
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
                            <p>{this.props.data.name[this.props.locale] && this.props.data.name}</p>
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
                </div>
            )
        } else {
            return null;
        }
    }
}

