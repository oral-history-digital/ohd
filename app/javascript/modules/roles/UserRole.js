import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaTrash } from 'react-icons/fa';

import { admin } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';

export default function UserRole ({
    userRole,
    hideEdit,
    projects,
    projectId,
    deleteData,
}) {

    const { t, locale } = useI18n();

    const show = () => {
        return (
            <Modal
                title={t('edit.user_role.show')}
                trigger={<FaEye className="Icon Icon--editorial" />}
            >
                {userRole.name}<br/>
                {userRole.desc}
            </Modal>
        )
    }

    const destroy = () => {
        deleteData({ projectId, projects, locale }, 'user_roles', userRole.id, null, null, true);
    }

    const deleteUserRole = () => {
        if (
            userRole &&
            !hideEdit &&
            admin(userRole, 'destroy')
        ) {
            return (
                <Modal
                    title={t('delete')}
                    trigger={<FaTrash className="Icon Icon--editorial" />}
                >
                    {closeModal => (
                        <div>
                            <p>{userRole.name}</p>
                            <button
                                type="button"
                                className="Button any-button"
                                onClick={() => { destroy(); closeModal(); }}
                            >
                                {t('delete')}
                            </button>
                        </div>
                    )}
                </Modal>
            );
        } else {
            return null;
        }
    }

    return (
        <div>
            {userRole.name}
            <span>
                {show()}
                {deleteUserRole()}
            </span>
        </div>
    )
}

UserRole.propTypes = {
    userRole: PropTypes.object.isRequired,
    hideEdit: PropTypes.bool,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};
