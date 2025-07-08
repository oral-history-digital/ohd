import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { useArchiveSearch } from 'modules/search';
import DeleteInterviews from './DeleteInterviews';
import UpdateInterviews from './UpdateInterviews';
import SubmitInterviewIds from './SubmitInterviewIds';
import { Spinner } from 'modules/spinners';
import DOIText from './DOIText';

export default function AdminActions({
    archiveIds,
    statuses,
    doiResult,
    setArchiveIds,
    addRemoveArchiveId,
}) {
    const { t } = useI18n();
    const { interviews, total, size, setSize } = useArchiveSearch();
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        if (total === interviews?.length && checkAll) {
            setArchiveIds(interviews.map(i => i.archive_id));
            setCheckAll(false);
        }
    }, [interviews]);

    const selectedArchiveIds = archiveIds.filter(
        archiveId => archiveId !== 'dummy');

    return (
        <div>
            <HelpText code="interview_actions" className="u-mb" />

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

            <ul className="UnorderedList u-mb">
                <AuthorizedContent object={{ type: 'Interview' }} action="dois">
                    <li>
                        <SubmitInterviewIds
                            selectedArchiveIds={selectedArchiveIds}
                            action="dois"
                            confirmText={<DOIText selectedArchiveIds={selectedArchiveIds} />}
                            format='zip'
                        />
                    </li>
                </AuthorizedContent>{' '}

                <AuthorizedContent object={{ type: 'Interview' }} action='download'>
                    <li>
                        <SubmitInterviewIds
                            selectedArchiveIds={selectedArchiveIds}
                            action="export_metadata"
                            filename='metdata.csv'
                            format='csv'
                        />
                    </li>
                </AuthorizedContent>{' '}

                <AuthorizedContent object={{ type: 'Interview' }} action='download'>
                    <li>
                        <SubmitInterviewIds
                            selectedArchiveIds={selectedArchiveIds}
                            action="reindex"
                        />
                    </li>
                </AuthorizedContent>{' '}

                <li>
                    <DeleteInterviews selectedArchiveIds={selectedArchiveIds} />
                </li>

                <AuthorizedContent
                    object={{ type: 'Interview' }}
                    action="update"
                >
                    <li>
                        <UpdateInterviews
                            selectedArchiveIds={selectedArchiveIds}
                            params={{ workflow_state: 'public' }}
                            action="publish"
                        />
                    </li>
                    <li>
                        <UpdateInterviews
                            selectedArchiveIds={selectedArchiveIds}
                            params={{ workflow_state: 'restricted' }}
                            action="restrict"
                        />
                    </li>
                    <li>
                        <UpdateInterviews
                            selectedArchiveIds={selectedArchiveIds}
                            params={{ workflow_state: 'unshared' }}
                            action="unpublish"
                        />
                    </li>
                    <li>
                        <UpdateInterviews
                            selectedArchiveIds={selectedArchiveIds}
                            params={{ biographies_workflow_state: 'public' }}
                            action="publish_biographies"
                        />
                    </li>
                    <li>
                        <UpdateInterviews
                            selectedArchiveIds={selectedArchiveIds}
                            params={{ biographies_workflow_state: 'unshared' }}
                            action="unpublish_biographies"
                        />
                    </li>
                </AuthorizedContent>
            </ul>

            <button
                type="button"
                className="Button"
                onClick={() => addRemoveArchiveId(-1)}
            >
                {t('reset')}
            </button>{' '}
            { checkAll ? <Spinner small /> :
                <button
                    type="button"
                    className="Button"
                    onClick={() => { setSize(total); setCheckAll(true) }}
                >
                    {t('set_all')}
                </button>
            }
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
