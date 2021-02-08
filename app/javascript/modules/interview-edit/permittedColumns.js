import { admin } from 'modules/auth';

export default function permittedColumns(props, interviewId) {
    let columns = ['timecode'];
    if (admin(props, {type: 'Segment', action: 'update', interview_id: interviewId}))
      columns = columns.concat(['text_orig', 'text_translated', 'mainheading_orig', 'subheading_orig', 'mainheading_translated', 'subheading_translated'])
    if (admin(props, {type: 'RegistryReference', action: 'update', interview_id: interviewId}))
        columns.push('registry_references');
    if (admin(props, {type: 'Annotation', action: 'update', interview_id: interviewId}))
        columns.push('annotations');
    return columns;
}
