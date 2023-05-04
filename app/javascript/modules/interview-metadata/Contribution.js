import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { DeleteItemForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { Modal } from 'modules/ui';
import ContributionFormContainer from './ContributionFormContainer';

export default function Contribution({
    person,
    projectId,
    project,
    archiveId,
    contribution,
    withSpeakerDesignation,
    deleteData,
    submitData
}) {
    const { t, locale } = useI18n();
    const { isAuthorized } = useAuthorization();

    const destroy = () => {
        deleteData({ locale, projectId, project }, 'interviews', archiveId, 'contributions', contribution.id);
        // TODO: Mutate after getting response.
        //mutatePersonWithAssociations(person.id);
    };

    if (!person) {
        return <Spinner small />;
    }

    if (isAuthorized(contribution, 'update') || contribution.workflow_state === 'public' ) {
        return (
            <span className="flyout-content-data">
                {person.display_name}

                {
                    withSpeakerDesignation ?
                        (<span>: {contribution.speaker_designation || t('edit.update_speaker.no_speaker_designation')}</span>) :
                        null
                }

                <AuthorizedContent object={contribution} action='update'>
                    <span className="flyout-sub-tabs-content-ico">
                        <Modal
                            title={t('edit.contribution.edit')}
                            trigger={<FaPencilAlt className="Icon Icon--editorial Icon--small" />}
                        >
                            {close => (
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
                            title={`${t('delete')} ${t('contributions.' + contribution.contribution_type)}`}
                            trigger={<FaTrash className="Icon Icon--editorial Icon--small" />}
                        >
                            {close => (
                                <DeleteItemForm
                                    onSubmit={() => { destroy(); close(); }}
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
    withSpeakerDesignation: PropTypes.bool.isRequired,
    archiveId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
};

Contribution.defaultProps = {
    withSpeakerDesignation: false,
};
