export default function permitted(permission, obj) {
    return (
        permission.klass === obj.type &&
        permission.action_name === obj.action &&
        (
            // check for interview_id only on non-interviews
            //
            (obj.type !== 'Interview' && permission.interview_id === obj.interview_id) ||
            (obj.type === 'Interview' && permission.interview_id === obj.id)
        )
    )
}
