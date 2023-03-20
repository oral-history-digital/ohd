import { useEffect, useState } from 'react';
import classNames from 'classnames';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

import { SingleValueWithFormContainer } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { humanReadable } from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { usePeople } from 'modules/person';
import { useArchiveSearch } from 'modules/search';
import { Spinner } from 'modules/spinners';
import TaskContainer from './TaskContainer';
import missingStill from 'assets/images/missing_still.png';

export default function InterviewWorkflowRow({
    interview,
    locale,
    translations,
    languages,
    collections,
    project,
    projectId,
    tasks,
    tasksStatus,
    userAccountsStatus,
    fetchData,
    setArchiveId,
}) {
    const [collapsed, setCollapsed] = useState(true);
    const { t } = useI18n();
    const pathBase = usePathBase();
    const { fulltext } = useArchiveSearch();
    const { data: people, isLoading } = usePeople();

    const params = { fulltext };
    const paramStr = queryString.stringify(params, { skipNull: true });
    const linkUrl = `${pathBase}/interviews/${interview.archive_id}?${paramStr}`;

    useEffect(() => {
        loadUserAccounts();
        loadTasks();
    }, []);

    function loadUserAccounts() {
        if (!userAccountsStatus.all) {
            fetchData({ projectId, project, locale }, 'users');
        }
    }

    function loadTasks() {
        if (!tasksStatus[`for_interview_${interview.archive_id}`]) {
            fetchData({ projectId, project, locale }, 'tasks', null, null, `for_interview=${interview.archive_id}`);
        }
    }

    function box(value, width='17-5') {
        return (
            <div className={`box box-${width}`}>
                {value}
            </div>
        )
    }

    function symbol(task) {
        return (
            <span
                className={task.workflow_state}
                key={task.id}
                title={task.task_type.label[locale]}
            >
                {task.task_type.abbreviation}
            </span>
        )
    }

    const tasksFetched = tasksStatus[`for_interview_${interview.archive_id}`] &&
        tasksStatus[`for_interview_${interview.archive_id}`].split('-')[0] === 'fetched';

    let interviewee;
    if (people) {
        interviewee = people[interview.interviewee_id];
    }

    return (
        <div className='border-top'>
            <div className='search-result-workflow data boxes'>
                {isLoading ? <Spinner small /> : (
                    <Link className="Link search-result-link box-10"
                        onClick={() => {
                            setArchiveId(interview.archive_id);
                        }}
                        to={linkUrl}
                    >
                        <img
                            className="workflow"
                            src={interview.still_url || 'missing_still'}
                            onError={(e)=> { e.target.src = missingStill; }}
                            alt=""
                        />
                        <span className='workflow' >
                            {interviewee?.names?.[locale]?.last_name + ', '}<br />
                            {interviewee?.names?.[locale]?.first_name }
                        </span>
                    </Link>
                )}

                {box(humanReadable(interview, 'archive_id', { locale, translations }, { collapsed }), '10')}
                {box(humanReadable(interview, 'media_type', { locale, translations }, { collapsed }), '10')}
                {box(humanReadable(interview, 'duration', { locale, translations }, { collapsed }), '10')}
                {box(humanReadable(interview, 'language_id', { locale, translations, languages }, { collapsed }), '10')}
                {box(humanReadable(interview, 'collection_id', { locale, translations, collections }, { collapsed }), '10')}

                <div className={classNames('box-30', collapsed ? 'workflow-inactive' : 'workflow-active')} >
                    {tasksFetched && (
                        <div className='workflow-symbols'>
                            {interview.task_ids.map(taskId => {
                                // using the slightly more complicated way to get task_types' use attribute
                                // (tasks[taskId].task_type.use would be easier)
                                // otherwise all tasks cache would have to be cleared on project configuration changes
                                //
                                if (project.task_types[tasks[taskId].task_type.id]?.use) {
                                    return symbol(tasks[taskId]);
                                }
                            })}

                            <span>
                                <button
                                    type="button"
                                    className="Button Button--transparent Button--icon"
                                    title={t(collapsed ? 'edit_workflow' : 'do_not_edit_workflow')}
                                    onClick={() => setCollapsed(prev => !prev)}
                                >
                                    {
                                        collapsed ?
                                            <FaAngleDown className="Icon Icon--text" /> :
                                            <FaAngleUp className="Icon Icon--text" />
                                    }
                                </button>
                            </span>
                        </div>
                    )}
                </div>

                {box(
                    <SingleValueWithFormContainer
                        elementType={'select'}
                        obj={interview}
                        attribute={'workflow_state'}
                        values={['public', 'unshared']}
                        optionsScope={'workflow_states'}
                        noStatusCheckbox={true}
                        noLabel={true}
                        withEmpty={true}
                    />, '10'
                )}
            </div>
            <div className='search-result-workflow-detail data boxes'>
                {!collapsed && (
                    <div className='workflow-active boxes header'>
                        {box(t('activerecord.attributes.task.task_type_id'))}
                        {box(t('activerecord.attributes.task.supervisor_id'))}
                        {box(t('activerecord.attributes.task.user_id'))}
                        {box(t('activerecord.attributes.task.workflow_state'))}
                        {box(t('activerecord.attributes.task.comments'), '30')}
                    </div>
                )}
                {!collapsed && tasksFetched && (
                    <div className='workflow-active tasks'>
                        <HelpText code="workflow_tasks" />
                        {interview.task_ids.map(taskId => {
                            if (project.task_types[tasks[taskId].task_type.id]?.use) {
                                return <TaskContainer task={tasks[taskId]} interview={interview} />
                            }
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

InterviewWorkflowRow.propTypes = {
    interview: PropTypes.object.isRequired,
    userAccountsStatus: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    tasks: PropTypes.object,
    tasksStatus: PropTypes.object.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
