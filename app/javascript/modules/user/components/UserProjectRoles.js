import { useState } from 'react';

import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { UserRoles } from 'modules/roles';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function UserProjectRoles({ roles }) {
    const { t } = useI18n();
    const user = useSelector(getCurrentUser);
    const [showRoles, setShowRoles] = useState(false);

    const hasRoles = roles && Object.keys(roles).length > 0;

    if (!hasRoles) {
        return null;
    }

    return (
        <div className="roles">
            <h4 className="title">
                {t('activerecord.models.role.other')}
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    onClick={() => setShowRoles((prev) => !prev)}
                >
                    {showRoles ? (
                        <FaAngleUp className="Icon Icon--primary" />
                    ) : (
                        <FaAngleDown className="Icon Icon--primary" />
                    )}
                </button>
            </h4>
            {showRoles ? (
                <UserRoles
                    userRoles={roles}
                    userId={user.id}
                    hideEdit={true}
                    hideAdd={true}
                />
            ) : null}
        </div>
    );
}

UserProjectRoles.propTypes = {
    roles: PropTypes.object,
};

export default UserProjectRoles;
