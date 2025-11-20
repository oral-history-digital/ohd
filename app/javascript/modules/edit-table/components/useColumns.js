import { useSelector } from 'react-redux';

import { useAuthorization } from 'modules/auth';
import { getSelectedColumns } from '../selectors';
import { ALPHA2_TO_ALPHA3 } from 'modules/constants';
import { useProject } from 'modules/routes';

export default function useColumns(interview) {
    const { isAuthorized } = useAuthorization();
    const selectedColumns = useSelector(getSelectedColumns);
    const { project } = useProject();
    const translationColumns = interview.translation_alpha3s.map(
        (alpha3) => `translation_${alpha3}`
    );
    const annotationColumns = interview.alpha3s.map(
        (alpha3) => `annotation_${alpha3}`
    );
    const headingColumns = project.available_locales
        .map((locale) => [
            `mainheading_${ALPHA2_TO_ALPHA3[locale]}`,
            `subheading_${ALPHA2_TO_ALPHA3[locale]}`,
        ])
        .flat();

    const columnOrder = ['timecode', 'transcript']
        .concat(translationColumns)
        .concat(headingColumns)
        .concat(['registry_references'])
        .concat(annotationColumns);

    function getPermittedColumns(interviewId) {
        let columns = ['timecode'];
        if (
            isAuthorized(
                { type: 'Segment', interview_id: interviewId },
                'update'
            )
        )
            columns = columns
                .concat(['transcript'])
                .concat(translationColumns)
                .concat(headingColumns);
        if (
            isAuthorized(
                { type: 'RegistryReference', interview_id: interviewId },
                'update'
            )
        )
            columns.push('registry_references');
        if (
            isAuthorized(
                { type: 'Annotation', interview_id: interviewId },
                'update'
            )
        )
            columns = columns.concat(annotationColumns);
        return columns;
    }

    const permittedColumns = getPermittedColumns(interview.id);

    const columns = columnOrder
        .filter((column) => selectedColumns.includes(column))
        .filter((column) => permittedColumns.includes(column));

    const gridTemplateColumns = columns
        .map((column) => {
            if (column === 'timecode') {
                return '1fr';
            } else {
                return '2fr';
            }
        })
        .join(' ');

    return {
        permittedColumns,
        columns,
        gridTemplateColumns,
    };
}
