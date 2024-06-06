import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaTrash } from 'react-icons/fa';

import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { useMutateData, useMutateDatum } from 'modules/data';
import { useDataApi } from 'modules/api';

export default function UserRole ({
    userRole,
    hideEdit,
    projects,
    projectId,
    deleteData,
    userId,
    dataPath,
}) {

    const { t, locale } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { deleteDatum } = useDataApi();
    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();

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
        mutateData( async users => {
            const result = await deleteDatum(userRole.id, 'user_roles');
            const updatedDatum = result.data;
            const userIndex = users.data.findIndex(u => u.id === userId);

            if (updatedDatum.id) {
                mutateDatum(userId, 'users');
            }

            const updatedUsers = [...users.data.slice(0, userIndex), updatedDatum, ...users.data.slice(userIndex + 1)];
            return { ...users, data: updatedUsers };
        });
    }

    const deleteUserRole = () => {
        if (
            userRole &&
            !hideEdit &&
            isAuthorized(userRole, 'destroy')
        ) {
            return (
                <Modal
                    key={`delete-userRole-${userId}`}
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
        <div key={`userRole-${userRole.id}`}>
            {userRole.name}
            <span>
                {false && show()}
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
