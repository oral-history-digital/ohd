import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import UserRoleFormContainer from './UserRoleFormContainer';
import UserRoleContainer from './UserRoleContainer';

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
                            <UserRoleContainer
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
                            <UserRoleFormContainer
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
    userRoles: PropTypes.object.isRequired,
    userId: PropTypes.number.isRequired,
    hideAdd: PropTypes.bool,
    hideEdit: PropTypes.bool,
};
