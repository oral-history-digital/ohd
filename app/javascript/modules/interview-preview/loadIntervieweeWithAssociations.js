export default function loadIntervieweeWithAssociations(props) {
    if (
           (props.interviewee && !props.interviewee.associations_loaded) ||
           (props.intervieweeId && !props.peopleStatus[props.intervieweeId])
    ) {
        props.fetchData(props, 'people', props.intervieweeId, null, 'with_associations=true');
    }
}
