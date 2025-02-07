import { useSelector } from 'react-redux';

import { useAuthorization } from 'modules/auth';
import { getSelectedColumns } from '../selectors';
import { useProject } from 'modules/routes';
import { ALPHA2_TO_ALPHA3 } from 'modules/constants';

const columnOrder = [
    'timecode',
    'text_orig',
    'text_translated',
    'mainheading_orig',
    'subheading_orig',
    'mainheading_translated',
    'subheading_translated',
    'registry_references',
    'annotations',
    'annotations_translated',
];

export default function useColumns(interview) {
    const { isAuthorized } = useAuthorization();
    const selectedColumns = useSelector(getSelectedColumns);
    const { project } = useProject();
    const headingColumns = project.available_locales.map( locale => 
        [`mainheading_${ALPHA2_TO_ALPHA3[locale]}`, `subheading_${ALPHA2_TO_ALPHA3[locale]}`]
    ).flat();

    const columnOrder = [
        'timecode',
        'text_orig',
        'text_translated',
    ].concat(headingColumns).concat([
        'registry_references',
        'annotations',
        'annotations_translated',
    ]);

    function getPermittedColumns(interviewId) {
        let columns = ['timecode'];
        if (isAuthorized({type: 'Segment', interview_id: interviewId}, 'update'))
          columns = columns.concat(['text_orig', 'text_translated', 'mainheading_orig', 'subheading_orig', 'mainheading_translated', 'subheading_translated'])
        if (isAuthorized({type: 'RegistryReference', interview_id: interviewId}, 'update'))
            columns.push('registry_references');
        if (isAuthorized({type: 'Annotation', interview_id: interviewId}, 'update'))
            columns.push('annotations');
            columns.push('annotations_translated');
        return columns;
    }

    const permittedColumns = getPermittedColumns(interview.id);

    const columns = columnOrder
        .filter(column => selectedColumns.includes(column))
        .filter(column => permittedColumns.includes(column));

    const gridTemplateColumns = columns.map(column => {
        if (column === 'timecode') {
            return '1fr';
        } else {
            return '2fr';
        }
    }).join(' ');

    return {
        permittedColumns,
        columns,
        gridTemplateColumns,
    }
}
