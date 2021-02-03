import React from 'react';
import PropTypes from 'prop-types';

import ContributionFormContainer from '../containers/ContributionFormContainer';
import { AuthorizedContent } from 'modules/auth';
import ContributionList from './ContributionList';
import { useI18n } from 'modules/i18n';

export default function InterviewContributors({
    interview,
    withSpeakerDesignation,
    submitData,
    openArchivePopup,
}) {
    const { t } = useI18n();

    return (
        <div>
            <ContributionList
                withSpeakerDesignation={withSpeakerDesignation}
            />

            <AuthorizedContent object={{type: 'Contribution', action: 'create', interview_id: interview.id}}>
                <p>
                    <button
                        type="button"
                        className='flyout-sub-tabs-content-ico-link'
                        onClick={() => openArchivePopup({
                            title: t('edit.contribution.new'),
                            content: <ContributionFormContainer
                                interview={interview}
                                submitData={submitData}
                                withSpeakerDesignation={withSpeakerDesignation}
                            />
                        })}
                    >
                        <i className="fa fa-plus"></i> {t('edit.contribution.new')}
                    </button>
                </p>
            </AuthorizedContent>
        </div>
    );

}

InterviewContributors.propTypes = {
    withSpeakerDesignation: PropTypes.bool.isRequired,
    interview: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
};

InterviewContributors.defaultProps = {
    withSpeakerDesignation: false,
};
