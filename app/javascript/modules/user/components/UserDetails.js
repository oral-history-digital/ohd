import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import UserDetailsFormContainer from './UserDetailsFormContainer';

export default function UserDetails({
    user,
}) {
    const { t } = useI18n();

    return (
        <>
            <div className='details box'>
                {['first_name', 'last_name', 'email'].map((detail) => {
                        return (
                            <p className='detail' key={detail}>
                                <span className='name'>{t(`activerecord.attributes.user.${detail}`) + ': '}</span>
                                <span className='content'>{user[detail]}</span>
                            </p>
                        )
                })}
            </div>
            <div className="buttons box">
                <Modal
                    title={t('edit.user.edit')}
                    trigger={<FaPencilAlt className="Icon Icon--primary" />}
                >
                    {close => (
                        <UserDetailsFormContainer
                            onSubmit={close}
                            onCancel={close}
                        />
                    )}
                </Modal>
            </div>
        </>
    )
}

UserDetails.propTypes = {
    user: PropTypes.object.isRequired,
};
