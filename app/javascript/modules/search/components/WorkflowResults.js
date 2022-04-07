import PropTypes from 'prop-types';

import { useQuery } from 'modules/react-toolbox';
import { Fetch, getTaskTypesForCurrentProjectFetched } from 'modules/data';
import { InterviewWorkflowRowContainer } from 'modules/workflow';
import WorkflowHeader from './WorkflowHeader';

export default function WorkflowResults({
    interviews,
    project,
}) {
    const searchParams = useQuery();

    const sortBy = searchParams.get('sort');
    const sortOrder = searchParams.get('order');

    function handleClick(newSortBy, newSortOrder) {
        //console.log(newSortBy, newSortOrder);
    }

    return (
        <Fetch
            fetchParams={['task_types', null, null, `for_projects=${project?.id}`]}
            testSelector={getTaskTypesForCurrentProjectFetched}
        >
            <div className="data boxes workflow-header">
                <WorkflowHeader
                    sortable="title"
                    order={sortBy === 'title' ? sortOrder : null}
                    onClick={handleClick}
                    width={10}
                    tKey="interview"
                />
                <WorkflowHeader
                    sortable="id"
                    order={sortBy === 'id' ? sortOrder : null}
                    onClick={handleClick}
                    width={10}
                    tKey="id"
                />
                <WorkflowHeader
                    sortable="media"
                    order={sortBy === 'media' ? sortOrder : null}
                    onClick={handleClick}
                    width={10}
                    tKey="activerecord.attributes.interview.media_type"
                />
                <WorkflowHeader
                    sortable="duration"
                    order={sortBy === 'duration' ? sortOrder : null}
                    onClick={handleClick}
                    width={10}
                    tKey="activerecord.attributes.interview.duration"
                />
                <WorkflowHeader
                    sortable="language"
                    order={sortBy === 'language' ? sortOrder : null}
                    onClick={handleClick}
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
                    sortable="state"
                    order={sortBy === 'state' ? sortOrder : null}
                    onClick={handleClick}
                    width={10}
                    tKey="activerecord.attributes.interview.workflow_state"
                />
            </div>
            {
                interviews?.map(interview => (
                    <InterviewWorkflowRowContainer
                        key={interview.id}
                        interview={interview}
                    />
                ))
            }
        </Fetch>
    );
}

WorkflowResults.propTypes = {
    query: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    interviews: PropTypes.array,
};
