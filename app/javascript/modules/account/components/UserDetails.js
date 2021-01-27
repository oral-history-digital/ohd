import React from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'bundles/archive/hooks/i18n';
import UserDetailsFormContainer from './UserDetailsFormContainer';

export default function UserDetails({
    account,
    openArchivePopup,
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
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t('edit.account.edit')}
                    onClick={() => openArchivePopup({
                        title: t('edit.account.edit'),
                        content: <UserDetailsFormContainer />
                    })}
                >
                    <i className="fa fa-pencil"></i>
                </div>
            </div>
        </>
    )
}

UserDetails.propTypes = {
    account: PropTypes.object.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
};
