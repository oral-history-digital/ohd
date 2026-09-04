import { getProjects } from 'modules/data';
import { useSelector } from 'react-redux';

import DataList from './DataList';
import { useAdminDataActions } from './hooks';

export default function TaskTypesList() {
    const projects = useSelector(getProjects);
    const { fetchData, deleteData, submitData } = useAdminDataActions();

    return (
        <DataList
            editView
            scope="task_type"
            detailsAttributes={['key', 'project_id']}
            formElements={[
                {
                    attribute: 'label',
                    multiLocale: true,
                },
                {
                    attribute: 'key',
                },
                {
                    attribute: 'abbreviation',
                    validate: function (v) {
                        return v?.length > 1;
                    },
                },
                {
                    elementType: 'input',
                    attribute: 'use',
                    type: 'checkbox',
                },
                {
                    elementType: 'select',
                    attribute: 'project_id',
                    values: projects,
                    withEmpty: true,
                },
            ]}
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
