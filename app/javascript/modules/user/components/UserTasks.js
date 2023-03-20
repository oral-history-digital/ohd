import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

import { getCurrentUser } from 'modules/data';
import { TasksOnlyStatusEditableContainer } from 'modules/workflow';
import { useI18n } from 'modules/i18n';

function UserTasks({
    tasks,
    supervisedTasks
}) {
    const user = useSelector(getCurrentUser);
    const { t } = useI18n();

    const other = Object.values(tasks).filter(t => t.workflow_state !== 'finished' && t.workflow_state !== 'cleared');
    const closedOther = Object.values(tasks).filter(t => t.workflow_state === 'finished' || t.workflow_state === 'cleared');
    const supervised = Object.values(supervisedTasks).filter(t => t.workflow_state !== 'cleared');
    const closedSupervised = Object.values(supervisedTasks).filter(t => t.workflow_state === 'cleared');

    return (
        <>
            <div className='user-registration boxes'>
                {taskGroup('other', other)}
                {taskGroup('supervised', supervised)}
            </div>
            <div className='user-registration boxes'>
                {taskGroup('closed_other', closedOther, false)}
                {taskGroup('closed_supervised', closedSupervised)}
            </div>
        </>
    )

}

function taskGroup(header, data, hideShow=true) {
    const { t } = useI18n();
    const [show, setShow] = useState(false);

    if (data?.length > 0) {
        return (
            <div className="tasks box">
                <button
                    type="button"
                    className="Button Button--transparent"
                    onClick={() => setShow(!show)}
                >
                    <h4 className="title">
                        {data.length + ' ' + t(`activerecord.models.task.${header}`)}
                        {
                            show ?
                                <FaAngleUp className="Icon Icon--editorial" /> :
                                <FaAngleDown className="Icon Icon--editorial" />
                        }
                    </h4>
                </button>
                {
                    show ?
                        <TasksOnlyStatusEditableContainer
                            data={data || {}}
                            hideShow={hideShow}
                            hideEdit={!hideShow}
                            hideDelete={true}
                            hideAdd={true}
                        /> : null
                }
            </div>
        )
    }
}

export default UserTasks;
