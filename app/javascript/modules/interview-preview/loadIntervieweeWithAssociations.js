export default function loadIntervieweeWithAssociations({
    interviewee,
    intervieweeId,
    peopleStatus,
    locale,
    projects,
    projectId,
    fetchData,
}) {
    if (
        (interviewee && !interviewee.associations_loaded) ||
        (intervieweeId && !peopleStatus[intervieweeId])
    ) {
        fetchData({ locale, projects, projectId }, 'people', intervieweeId,
            null, 'with_associations=true');
    }
}
