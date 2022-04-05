import { useState } from 'react';
import PropTypes from 'prop-types';

import { Fetch, getTaskTypesForCurrentProjectFetched } from 'modules/data';
import { InterviewWorkflowRowContainer } from 'modules/workflow';
import SortHeader from './SortHeader';

export default function WorkflowResults({
    query,
    project,
    foundInterviews,
    onSortOrderChange,
}) {
    const [sortings, setSortings] = useState({
        title: 'asc',
        archive_id: 'asc',
        media_type: 'asc',
        duration: 'asc',
        language: 'asc',
        workflow_state: 'asc',
    });

    function sort(column, direction) {
        setSortings(prev => ({
            ...prev,
            [column]: direction,
        }));
        onSortOrderChange({
            ...query,
            order: `${column}-${direction}`,
            page: 1,
        });
    }

    return (
        <Fetch
            fetchParams={['task_types', null, null, `for_projects=${project?.id}`]}
            testSelector={getTaskTypesForCurrentProjectFetched}
        >
            <div className="data boxes workflow-header">
                <SortHeader
                    sortColumn="title"
                    direction={sortings.title}
                    width={10}
                    tKey="interview"
                    onClick={sort}
                />
                <SortHeader
                    sortColumn="archive_id"
                    direction={sortings.archive_id}
                    width={10}
                    tKey="id"
                    onClick={sort}
                />
                <SortHeader
                    sortColumn="media_type"
                    direction={sortings.media_type}
                    width={10}
                    tKey="activerecord.attributes.interview.media_type"
                    onClick={sort}
                />
                <SortHeader
                    sortColumn="duration"
                    direction={sortings.duration}
                    width={10}
                    tKey="activerecord.attributes.interview.duration"
                    onClick={sort}
                />
                <SortHeader
                    sortColumn="language"
                    direction={sortings.language}
                    width={10}
                    tKey="activerecord.attributes.interview.language"
                    onClick={sort}
                />

                <SortHeader
                    width={10}
                    tKey="activerecord.attributes.interview.collection_id"
                />
                <SortHeader
                    width={30}
                    tKey="activerecord.attributes.interview.tasks_states"
                />
                <SortHeader
                    sortColumn="workflow_state"
                    direction={sortings.workflow_state}
                    width={10}
                    tKey="activerecord.attributes.interview.workflow_state"
                    onClick={sort}
                />
            </div>
            {
                foundInterviews?.map(interview => (
                    <InterviewWorkflowRowContainer
                        interview={interview}
                        key={interview.archive_id}
                    />
                ))
            }
        </Fetch>
    );
}

WorkflowResults.propTypes = {
    query: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    foundInterviews: PropTypes.array,
    onSortOrderChange: PropTypes.func.isRequired,
};
