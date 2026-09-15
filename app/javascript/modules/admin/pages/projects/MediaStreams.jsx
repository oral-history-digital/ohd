import {
    getCurrentProject,
    getMediaStreamsForCurrentProject,
} from 'modules/data';
import { useSelector } from 'react-redux';

import { DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function MediaStreams() {
    const project = useSelector(getCurrentProject);
    const data = useSelector(getMediaStreamsForCurrentProject);
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    return (
        <DataList
            editView
            data={data}
            outerScope="project"
            outerScopeId={project.id}
            scope="media_stream"
            detailsAttributes={['path', 'media_type']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                {
                    attribute: 'media_type',
                    elementType: 'select',
                    values: ['still', 'video', 'audio'],
                    withEmpty: true,
                },
                {
                    attribute: 'path',
                    elementType: 'input',
                    help: 'help_texts.media_streams.path',
                },
                { attribute: 'resolution', elementType: 'input' },
            ]}
            helpTextCode="mediapath_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
