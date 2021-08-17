import { admin } from 'modules/auth';

export default function permittedColumns(props, interviewId) {
    let columns = ['timecode'];
    if (admin(props, {type: 'Segment', interview_id: interviewId}, 'update'))
      columns = columns.concat(['text_orig', 'text_translated', 'mainheading_orig', 'subheading_orig', 'mainheading_translated', 'subheading_translated'])
    if (admin(props, {type: 'RegistryReference', interview_id: interviewId}, 'update'))
        columns.push('registry_references');
    if (admin(props, {type: 'Annotation', interview_id: interviewId}, 'update'))
        columns.push('annotations');
    return columns;
}
