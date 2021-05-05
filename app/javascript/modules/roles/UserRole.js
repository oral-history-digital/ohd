import React from 'react';
import PropTypes from 'prop-types';

import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';

export default class UserRole extends React.Component {
    show() {
        return (
            <Modal
                title={t(this.props, 'edit.user_role.show')}
                trigger={<i className="fa fa-eye"/>}
            >
                {this.props.userRole.name}<br/>
                {this.props.userRole.desc}
            </Modal>
        )
    }

    destroy() {
        this.props.deleteData(this.props, 'user_roles', this.props.userRole.id, null, null, true);
    }

    delete() {
        if (
            this.props.userRole &&
            !this.props.hideEdit &&
            admin(this.props, this.props.userRole, 'update')
        ) {
            return (
                <Modal
                    title={t(this.props, 'delete')}
                    trigger={<i className="fa fa-trash-o"/>}
                >
                    {closeModal => (
                        <div>
                            <p>{this.props.userRole.name}</p>
                            <button
                                type="button"
                                className="any-button"
                                onClick={() => { this.destroy(); closeModal(); }}
                            >
                                {t(this.props, 'delete')}
                            </button>
                        </div>
                    )}
                </Modal>
            );
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

UserRole.propTypes = {
    userRole: PropTypes.object.isRequired,
    hideEdit: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};
