import React from 'react';

import { t, pluralize, admin } from '../../../lib/utils';

export default class Task extends React.Component {

    details() {
        return (
            <div className='details'>
                {
                    [
                        'name',
                        'desc',
                        'authorized_id',
                        'authorized_type',
                    ].map((detail, index) => {
                        return (
                            <p className='detail'>
                                <span className='name'>{t(this.props, `activerecord.attributes.task.${detail}`) + ': '}</span>
                                <span className='content'>{this.props.task[detail]}</span>
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
                title={t(this.props, 'edit.tasks.show')}
                onClick={() => this.props.openArchivePopup({
                    title: this.props.task.name,
                    content: this.details()
                })}
            >
                <i className="fa fa-eye"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData('tasks', this.props.task.id, null, null, true);
        this.props.closeArchivePopup();
    }

    delete() {
        if (this.props.task) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'delete')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'delete'),
                    content: (
                        <div>
                            <p>{this.props.task.name}</p>
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
        return (
            <span className={'flyout-sub-tabs-content-ico'}>
                {this.show()}
                {this.delete()}
            </span>
        )
    }

    render() {
        return (
            <div>
                {this.props.task.name}
                {this.buttons()}
            </div>
        )
    }
}

