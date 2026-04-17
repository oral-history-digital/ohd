import {
    addRemoveArchiveId,
    getDoiResult,
    setArchiveIds,
} from 'modules/archive';
import { AuthorizedContent } from 'modules/auth';
import { useArchiveSearchIds } from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import DOIText from './DOIText';
import DeleteInterviews from './DeleteInterviews';
import SubmitInterviewIds from './SubmitInterviewIds';
import UpdateInterviews from './UpdateInterviews';

export default function AdminActions({ archiveIds }) {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const doiResult = useSelector(getDoiResult);
    const { allParams } = useSearchParams();
    const { fetchAllFilteredArchiveIds, isLoading: checkAll } =
        useArchiveSearchIds();

    async function selectAllFilteredInterviews() {
        const archiveIdsForSelection =
            await fetchAllFilteredArchiveIds(allParams);
        dispatch(setArchiveIds(archiveIdsForSelection));
    }

    const selectedArchiveIds = archiveIds.filter(
        (archiveId) => archiveId !== 'dummy'
    );

    return (
        <div>
            <HelpText code="interview_actions" className="u-mb" />
            {Object.keys(doiResult).length > 0 && (
                <div>
                    <h4>DOI Status:</h4>
                    {Object.keys(doiResult).map((archiveId) => (
                        <div key={archiveId}>
                            {`${archiveId}: ${doiResult[archiveId]}`}
                        </div>
                    ))}
                </div>
            )}
            <ul className="UnorderedList u-mb">
                <AuthorizedContent object={{ type: 'Interview' }} action="dois">
                    <li>
                        <SubmitInterviewIds
                            selectedArchiveIds={selectedArchiveIds}
                            action="dois"
                            confirmText={
                                <DOIText
                                    selectedArchiveIds={selectedArchiveIds}
                                />
                            }
                            format="zip"
                        />
                    </li>
                </AuthorizedContent>{' '}
                <AuthorizedContent
                    object={{ type: 'Interview' }}
                    action="download"
                >
                    <li>
                        <SubmitInterviewIds
                            selectedArchiveIds={selectedArchiveIds}
                            action="export_metadata"
                            filename="metdata.csv"
                            format="csv"
                        />
                    </li>
                </AuthorizedContent>{' '}
                <AuthorizedContent
                    object={{ type: 'Interview' }}
                    action="download"
                >
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
                onClick={() => dispatch(addRemoveArchiveId(-1))}
            >
                {t('reset')}
            </button>{' '}
            {checkAll ? (
                <Spinner size="small" />
            ) : (
                <button
                    type="button"
                    className="Button"
                    onClick={selectAllFilteredInterviews}
                >
                    {t('set_all')}
                </button>
            )}
        </div>
    );
}

AdminActions.propTypes = {
    archiveIds: PropTypes.array,
};
