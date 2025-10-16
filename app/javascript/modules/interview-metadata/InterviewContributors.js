import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import ContributionList from './ContributionList';
import ContributionFormContainer from './ContributionFormContainer';

export default function InterviewContributors({
    interview,
    withSpeakerDesignation = false,
    submitData,
}) {
    const { t } = useI18n();

    return (
        <div>
            <ContributionList
                withSpeakerDesignation={withSpeakerDesignation}
                interview={interview}
            />

            <AuthorizedContent
                object={{ type: 'Contribution', interview_id: interview.id }}
                action="create"
            >
                <p>
                    <Modal
                        title={t('edit.contribution.new')}
                        trigger={
                            <>
                                <FaPlus className="Icon Icon--editorial Icon--small" />{' '}
                                {t(
                                    'modules.interview_metadata.add_contributors'
                                )}
                            </>
                        }
                    >
                        {(close) => (
                            <ContributionFormContainer
                                interview={interview}
                                withSpeakerDesignation={withSpeakerDesignation}
                                submitData={submitData}
                                onSubmit={close}
                                onCancel={close}
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
    submitData: PropTypes.func.isRequired,
};
