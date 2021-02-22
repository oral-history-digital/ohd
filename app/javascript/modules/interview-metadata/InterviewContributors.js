import React from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import ContributionList from './ContributionList';
import ContributionFormContainer from './ContributionFormContainer';

export default function InterviewContributors({
    interview,
    withSpeakerDesignation,
}) {
    const { t } = useI18n();

    return (
        <div>
            <ContributionList
                withSpeakerDesignation={withSpeakerDesignation}
            />

            <AuthorizedContent object={{type: 'Contribution', action: 'create', interview_id: interview.id}}>
                <p>
                    <Modal
                        title={t('edit.contribution.new')}
                        trigger={<i className="fa fa-plus" />}
                        triggerClassName="flyout-sub-tabs-content-ico-link"
                    >
                        {close => (
                            <ContributionFormContainer
                                interview={interview}
                                withSpeakerDesignation={withSpeakerDesignation}
                                onSubmit={close}
                            />
                        )}
                    </Modal>
                </p>
            </AuthorizedContent>
        </div>
    );

}

InterviewContributors.propTypes = {
    interview: PropTypes.object.isRequired,
    withSpeakerDesignation: PropTypes.bool.isRequired,
};

InterviewContributors.defaultProps = {
    withSpeakerDesignation: false,
};
