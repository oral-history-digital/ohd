import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import ContributionList from './ContributionList';
import ContributionFormContainer from './ContributionFormContainer';

export default function InterviewContributors({
    interview,
    withSpeakerDesignation,
    submitData
}) {
    const { t } = useI18n();

    return (
        <div>
            <ContributionList
                withSpeakerDesignation={withSpeakerDesignation}
            />

            <AuthorizedContent object={{type: 'Contribution', interview_id: interview.id}} action='create'>
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
                                submitData={submitData}
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
