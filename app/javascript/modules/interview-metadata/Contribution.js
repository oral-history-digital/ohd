import React from 'react';
import PropTypes from 'prop-types';

import { fullname } from 'lib/utils';
import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import ContributionFormContainer from './ContributionFormContainer';

export default function Contribution({
    locale,
    person,
    projectId,
    archiveId,
    contribution,
    withSpeakerDesignation,
    submitData,
    deleteData,
    openArchivePopup,
    closeArchivePopup,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    const destroy = () => {
        deleteData({ locale, projectId }, 'interviews', archiveId, 'contributions', contribution.id);
        closeArchivePopup();
    };

    if (isAuthorized(contribution) || contribution.workflow_state === 'public' ) {
        return (
            <span className="flyout-content-data">
                {fullname({ locale }, person)}

                {
                    withSpeakerDesignation ?
                        (<span>: {contribution.speaker_designation || t('edit.update_speaker.no_speaker_designation')}</span>) :
                        null
                }

                <AuthorizedContent object={contribution}>
                    <span className="flyout-sub-tabs-content-ico">
                        <button
                            type="button"
                            className='flyout-sub-tabs-content-ico-link'
                            title={t('edit.contribution.edit')}
                            onClick={() => openArchivePopup({
                                title: t('edit.contribution.edit'),
                                content: <ContributionFormContainer
                                    contribution={contribution}
                                    submitData={submitData}
                                    withSpeakerDesignation
                                />
                            })}
                        >
                            <i className="fa fa-pencil"></i>
                        </button>

                        <button
                            type="button"
                            className='flyout-sub-tabs-content-ico-link'
                            title={t('delete')}
                            onClick={() => openArchivePopup({
                                title: `${t('delete')} ${t('contributions.' + contribution.contribution_type)}`,
                                content: (
                                    <div>
                                        <p>{fullname({ locale }, person)}</p>
                                        <div className='any-button' onClick={destroy}>
                                            {t('delete')}
                                        </div>
                                    </div>
                                )
                            })}
                        >
                            <i className="fa fa-trash-o"></i>
                        </button>
                    </span>
                </AuthorizedContent>
            </span>
        );
    } else {
        return null;
    }
}

Contribution.propTypes = {
    person: PropTypes.object,
    contribution: PropTypes.object.isRequired,
    withSpeakerDesignation: PropTypes.bool.isRequired,
    archiveId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    deleteData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
};

Contribution.defaultProps = {
    withSpeakerDesignation: false,
};
