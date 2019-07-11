import React from 'react';

import { t, pluralize, admin } from '../../../lib/utils';

export default class UserRole extends React.Component {

    show() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.user_role.show')}
                onClick={() => this.props.openArchivePopup({
                    title: this.props.userRole.name,
                    content: this.props.userRole.desc
                })}
            >
                <i className="fa fa-eye"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData('user_roles', this.props.userRole.id, null, null, true);
        this.props.closeArchivePopup();
    }

    delete() {
        if (
            this.props.userRole &&
            !this.props.hideEdit &&
            admin(this.props, this.props.userRole)
        ) {
            return <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'delete')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'delete'),
                    content: (
                        <div>
                            <p>{this.props.userRole.name}</p>
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
                {this.props.userRole.name}
                {this.buttons()}
            </div>
        )
    }
}

