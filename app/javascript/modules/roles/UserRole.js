import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaTrash } from 'react-icons/fa';

import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';

export default class UserRole extends Component {
    show() {
        return (
            <Modal
                title={t(this.props, 'edit.user_role.show')}
                trigger={<FaEye className="Icon Icon--editorial" />}
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
            admin(this.props, this.props.userRole, 'destroy')
        ) {
            return (
                <Modal
                    title={t(this.props, 'delete')}
                    trigger={<FaTrash className="Icon Icon--editorial" />}
                >
                    {closeModal => (
                        <div>
                            <p>{this.props.userRole.name}</p>
                            <button
                                type="button"
                                className="Button any-button"
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
            <span>
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
