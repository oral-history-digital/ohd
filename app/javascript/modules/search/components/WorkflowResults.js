import { Fetch, getTaskTypesForCurrentProjectFetched } from 'modules/data';
import { HelpText } from 'modules/help-text';
import { InterviewWorkflowRowContainer } from 'modules/workflow';
import PropTypes from 'prop-types';

import WorkflowHeader from './WorkflowHeader';

export default function WorkflowResults({ interviews, project }) {
    return (
        <Fetch
            fetchParams={[
                'task_types',
                null,
                null,
                `for_projects=${project?.id}`,
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
    project: PropTypes.object.isRequired,
    interviews: PropTypes.array,
};
