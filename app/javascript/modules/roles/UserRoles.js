import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import UserRole from './UserRole';
import UserRoleForm from './UserRoleForm';

/**
 * Lists a user's project roles and opens the role-assignment form when permitted.
 * @param {Object} props - Assignments, user ID, user-list cache path, and action visibility.
 * @returns {React.ReactElement} Role list and authorized add control.
 */
export default function UserRoles({
    userRoles,
    userId,
    dataPath,
    hideEdit,
    hideAdd,
}) {
    const { t } = useI18n();
    return (
        <>
            <ul className="DetailList">
                {Object.keys(userRoles).map((id) => {
                    return (
                        <li
                            key={`user-role-li-${id}`}
                            className="DetailList-item"
                        >
                            <UserRole
                                userRole={userRoles[id]}
                                userId={userId}
                                key={`userRole-${id}`}
                                hideEdit={hideEdit}
                                dataPath={dataPath}
                            />
                        </li>
                    );
                })}
            </ul>
            <AuthorizedContent object={{ type: 'UserRole' }} action="create">
                {!hideAdd && (
                    <Modal
                        key={`add-userRole-${userId}`}
                        title={t('edit.user_role.new')}
                        trigger={<FaPlus className="Icon Icon--editorial" />}
                    >
                        {(closeModal) => (
                            <UserRoleForm
                                userId={userId}
                                onSubmit={closeModal}
                                dataPath={dataPath}
                            />
                        )}
                    </Modal>
                )}
            </AuthorizedContent>
        </>
    );
}

UserRoles.propTypes = {
    userRoles: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
        .isRequired,
    dataPath: PropTypes.string,
    userId: PropTypes.number.isRequired,
    hideAdd: PropTypes.bool,
    hideEdit: PropTypes.bool,
};
