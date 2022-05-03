import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useArchiveSearch } from 'modules/search';
import DeleteInterviews from './DeleteInterviews';
import UpdateInterviews from './UpdateInterviews';
import SubmitInterviewIds from './SubmitInterviewIds';
import DOIText from './DOIText';

export default function AdminActions({
    archiveIds,
    statuses,
    doiResult,
    setArchiveIds,
    addRemoveArchiveId,
}) {
    const { t } = useI18n();
    const { interviews } = useArchiveSearch();

    const selectedArchiveIds = archiveIds.filter(
        archiveId => archiveId !== 'dummy');

    return (
        <div>
            {Object.keys(doiResult).length > 0 && (
                <div>
                    <h4>DOI Status:</h4>
                    {
                        Object.keys(doiResult).map(archiveId => (
                            <div key={archiveId}>
                                {`${archiveId}: ${doiResult[archiveId]}`}
                            </div>
                        ))
                    }
                </div>
            )}

            <AuthorizedContent object={{ type: 'Interview' }} action="dois">
                {' '}
                <SubmitInterviewIds
                    selectedArchiveIds={selectedArchiveIds}
                    action="dois"
                    confirmText={<DOIText selectedArchiveIds={selectedArchiveIds} />}
                />{' '}
            </AuthorizedContent>{' '}
            <AuthorizedContent
                object={{ type: 'Interview' }}
                action="update"
            >
                {' '}
                <SubmitInterviewIds
                    selectedArchiveIds={selectedArchiveIds}
                    action="export_photos"
                    filename="photos.zip"
                />{' '}
            </AuthorizedContent>{' '}

            {
                selectedArchiveIds.map(archiveId => {
                    if (statuses[archiveId] !== undefined) {
                        return (
                            <div key={archiveId}>
                                {' '}
                                {`${archiveId}: ${statuses[archiveId]}`}{' '}
                            </div>
                        );
                    }
                })
            }

            <DeleteInterviews selectedArchiveIds={selectedArchiveIds} />{' '}

            <AuthorizedContent
                object={{ type: 'Interview' }}
                action="update"
            >
                {' '}
                <UpdateInterviews
                    selectedArchiveIds={selectedArchiveIds}
                    params={{ workflow_state: 'public' }}
                    action="publish"
                />{' '}
                <UpdateInterviews
                    selectedArchiveIds={selectedArchiveIds}
                    params={{ workflow_state: 'unshared' }}
                    action="unpublish"
                />{' '}
                <UpdateInterviews
                    selectedArchiveIds={selectedArchiveIds}
                    params={{ biographies_workflow_state: 'public' }}
                    action="publish_biographies"
                />{' '}
                <UpdateInterviews
                    selectedArchiveIds={selectedArchiveIds}
                    params={{ biographies_workflow_state: 'unshared' }}
                    action="publish_biographies"
                />{' '}
            </AuthorizedContent>{' '}

            <button
                type="button"
                className="Button"
                onClick={() => addRemoveArchiveId(-1)}
            >
                {t('reset')}
            </button>{' '}
            <button
                type="button"
                className="Button"
                onClick={() => setArchiveIds(interviews?.map(i => i.archive_id))}
            >
                {t('set_all')}
            </button>{' '}
        </div>
    );
}

AdminActions.propTypes = {
    archiveIds: PropTypes.array,
    doiResult: PropTypes.object,
    statuses: PropTypes.object,
    setArchiveIds: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
};
