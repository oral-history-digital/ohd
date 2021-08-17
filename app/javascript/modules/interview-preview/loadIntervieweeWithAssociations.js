export default function loadIntervieweeWithAssociations(props) {
    let intervieweeContribution = Object.values(props.interview.contributions).find(c => c.contribution_type === 'interviewee');
    let intervieweeId = intervieweeContribution && intervieweeContribution.person_id;
    let interviewee = props.projects[props.interview.project_id].people[intervieweeId]
    if (
           ((interviewee && !interviewee.associations_loaded) || !interviewee) &&
           intervieweeId && !props.peopleStatus[intervieweeId]
    ) {
        props.fetchData(props, 'people', intervieweeId, null, 'with_associations=true');
    }
}
