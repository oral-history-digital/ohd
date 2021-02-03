import React from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import UserDetailsFormContainer from './UserDetailsFormContainer';

export default function UserDetails({
    account,
}) {
    const { t } = useI18n();

    return (
        <>
            <div className='details box'>
                {['first_name', 'last_name', 'email'].map((detail) => {
                        return (
                            <p className='detail' key={detail}>
                                <span className='name'>{t(`activerecord.attributes.account.${detail}`) + ': '}</span>
                                <span className='content'>{account[detail]}</span>
                            </p>
                        )
                })}
            </div>
            <div className="buttons box">
                <Modal
                    title={t('edit.account.edit')}
                    trigger={<i className="fa fa-pencil"/>}
                >
                    {closeModal => (
                        <UserDetailsFormContainer onSubmit={closeModal} />
                    )}
                </Modal>
            </div>
        </>
    )
}

UserDetails.propTypes = {
    account: PropTypes.object.isRequired,
};
