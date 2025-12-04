import { useState } from 'react';

import { useI18n } from 'modules/i18n';
import { TasksOnlyStatusEditableContainer } from 'modules/workflow';
import PropTypes from 'prop-types';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

function UserTasks({ tasks, supervisedTasks }) {
    const hasTasks = tasks && Object.keys(tasks).length > 0;
    const hasSupervisedTasks =
        supervisedTasks && Object.keys(supervisedTasks).length > 0;

    if (!hasTasks && !hasSupervisedTasks) {
        return null;
    }

    const other = Object.values(tasks || {}).filter(
        (t) => t.workflow_state !== 'finished' && t.workflow_state !== 'cleared'
    );
    const closedOther = Object.values(tasks || {}).filter(
        (t) => t.workflow_state === 'finished' || t.workflow_state === 'cleared'
    );
    const supervised = Object.values(supervisedTasks || {}).filter(
        (t) => t.workflow_state !== 'cleared'
    );
    const closedSupervised = Object.values(supervisedTasks || {}).filter(
        (t) => t.workflow_state === 'cleared'
    );

    return (
        <>
            <div className="user-registration boxes">
                <TaskGroup header="other" data={other} />
                <TaskGroup header="supervised" data={supervised} />
            </div>
            <div className="user-registration boxes">
                <TaskGroup
                    header="closed_other"
                    data={closedOther}
                    hideShow={false}
                />
                <TaskGroup header="closed_supervised" data={closedSupervised} />
            </div>
        </>
    );
}

function TaskGroup({ header, data, hideShow = true }) {
    const { t } = useI18n();
    const [show, setShow] = useState(false);

    if (data?.length > 0) {
        return (
            <div className="tasks">
                <button
                    type="button"
                    className="Button Button--transparent"
                    onClick={() => setShow(!show)}
                >
                    <h4 className="title">
                        {data.length +
                            ' ' +
                            t(`activerecord.models.task.${header}`)}
                        {show ? (
                            <FaAngleUp className="Icon Icon--editorial" />
                        ) : (
                            <FaAngleDown className="Icon Icon--editorial" />
                        )}
                    </h4>
                </button>
                {show ? (
                    <TasksOnlyStatusEditableContainer
                        data={data || {}}
                        hideShow={hideShow}
                        hideEdit={!hideShow}
                        hideDelete={true}
                        hideAdd={true}
                    />
                ) : null}
            </div>
        );
    }
    return null;
}

TaskGroup.propTypes = {
    header: PropTypes.string.isRequired,
    data: PropTypes.array,
    hideShow: PropTypes.bool,
};

UserTasks.propTypes = {
    tasks: PropTypes.object,
    supervisedTasks: PropTypes.object,
};

export default UserTasks;
