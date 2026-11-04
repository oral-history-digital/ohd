import { Fetch, getTaskTypesForCurrentProjectFetched } from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useProjectIdentity } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InterviewWorkflowRowContainer } from 'modules/workflow';
import PropTypes from 'prop-types';

import WorkflowHeader from './WorkflowHeader';

/**
 * Loads workflow task types separately using the current project identity.
 * @param {Object} props - Workflow results.
 * @param {Object[]} [props.interviews] - Interviews to display.
 * @returns {React.ReactElement} Workflow rows after their task-type resource loads.
 */
export default function WorkflowResults({ interviews }) {
    const { projectDbId } = useProjectIdentity();
    if (!projectDbId) return <Spinner />;
    return (
        <Fetch
            fetchParams={[
                'task_types',
                null,
                null,
                `for_projects=${projectDbId}`,
            ]}
            testSelector={getTaskTypesForCurrentProjectFetched}
        >
            <HelpText code="workflow_management" className="u-mb" />

            <div className="data boxes workflow-header">
                <WorkflowHeader width={10} tKey="interview" />
                <WorkflowHeader width={10} tKey="interview_id" />
                <WorkflowHeader
                    width={10}
                    tKey="activerecord.attributes.interview.media_type"
                />
                <WorkflowHeader
                    width={10}
                    tKey="activerecord.attributes.interview.duration"
                />
                <WorkflowHeader
                    width={10}
                    tKey="activerecord.attributes.interview.language"
                />
                <WorkflowHeader
                    width={10}
                    tKey="activerecord.attributes.interview.collection_id"
                />
                <WorkflowHeader
                    width={30}
                    tKey="activerecord.attributes.interview.tasks_states"
                />
                <WorkflowHeader
                    width={10}
                    tKey="activerecord.attributes.interview.workflow_state"
                />
            </div>
            {interviews?.map((interview) => (
                <InterviewWorkflowRowContainer
                    key={interview.id}
                    interview={interview}
                />
            ))}
        </Fetch>
    );
}

WorkflowResults.propTypes = {
    interviews: PropTypes.array,
};
