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
    userRegistrationId,
}) {

    const { t, locale } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { deleteDatum } = useDataApi();
    const mutateData = useMutateData('user_registrations');
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
        mutateData( async data => {
            const result = await deleteDatum(userRole.id, 'user_roles');
            const updatedDatum = result.data;

            if (userRegistrationId) {
                mutateDatum(userRegistrationId, 'user_registrations');
            }

            //if (typeof onSubmit === 'function') {
                //onSubmit();
            //}

            const updatedData = {
                ...data,
                data: {
                    ...data.data,
                    [updatedDatum.id]: updatedDatum
                }
            };

            return updatedData;
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
