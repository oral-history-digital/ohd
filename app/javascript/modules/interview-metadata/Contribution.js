import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import {
    useInvalidateAllPersonData,
    useInvalidateInterviewContributors,
} from 'modules/person';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import ContributionFormContainer from './ContributionFormContainer';

/**
 * Shows a permitted interview contributor and authorized editing controls.
 *
 * @param {Object} props - Contribution context.
 * @param {Object} [props.person] - Contributor display data.
 * @param {string} props.archiveId - Public interview identifier.
 * @param {Object} props.contribution - Contribution and publication settings.
 * @param {Object} [props.interview] - Interview used for contributor-cache invalidation.
 * @param {boolean} [props.withSpeakerDesignation=false] - Displays the speaker designation.
 * @param {Function} props.deleteData - Deletes the nested contribution through Redux.
 * @param {Function} props.submitData - Saves contribution edits.
 * @returns {React.ReactElement|null} Contributor controls, loading indicator, or nothing when hidden.
 */
export default function Contribution({
    person,
    archiveId,
    contribution,
    interview,
    withSpeakerDesignation = false,
    deleteData,
    submitData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const { isAuthorized } = useAuthorization();
    const invalidateInterviewContributors = useInvalidateInterviewContributors(
        interview?.id
    );
    const invalidateAllPersonData = useInvalidateAllPersonData();

    const destroy = async () => {
        deleteData(
            { pathBase },
            'interviews',
            archiveId,
            'contributions',
            contribution.id
        );
        // Invalidate caches after deletion
        await invalidateInterviewContributors();
        await invalidateAllPersonData();
    };
    if (!person) {
        return <Spinner size="small" />;
    }

    if (
        isAuthorized(contribution, 'update') ||
        contribution.workflow_state === 'public'
    ) {
        return (
            <span className="flyout-content-data">
                {person.display_name}

                {withSpeakerDesignation ? (
                    <span>
                        :{' '}
                        {contribution.speaker_designation ||
                            t('edit.update_speaker.no_speaker_designation')}
                    </span>
                ) : null}

                <AuthorizedContent object={contribution} action="update">
                    <span className="flyout-sub-tabs-content-ico">
                        <Modal
                            title={t('edit.contribution.edit')}
                            trigger={
                                <FaPencilAlt className="Icon Icon--editorial Icon--small" />
                            }
                        >
                            {(close) => (
                                <ContributionFormContainer
                                    data={contribution}
                                    withSpeakerDesignation
                                    submitData={submitData}
                                    onSubmit={close}
                                    onCancel={close}
                                />
                            )}
                        </Modal>
                        <Modal
                            title={`${t('delete')} ${t(
                                'contributions.' +
                                    contribution.contribution_type
                            )}`}
                            trigger={
                                <FaTrash className="Icon Icon--editorial Icon--small" />
                            }
                        >
                            {(close) => (
                                <DeleteItemForm
                                    onSubmit={() => {
                                        destroy();
                                        close();
                                    }}
                                    onCancel={close}
                                >
                                    <p>{person.display_name}</p>
                                </DeleteItemForm>
                            )}
                        </Modal>
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
    interview: PropTypes.object,
    withSpeakerDesignation: PropTypes.bool.isRequired,
    archiveId: PropTypes.string.isRequired,
    deleteData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
};
