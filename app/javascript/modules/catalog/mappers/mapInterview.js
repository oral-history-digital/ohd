export default function mapInterview(locale, interview) {
    return {
        type: 'interview',
        id: interview.id,
        shortname: interview.archive_id,
        name: interview.anonymous_title[locale],
        project_id: interview.project_id,
    };
}
