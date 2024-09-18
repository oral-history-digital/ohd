export default function userIsEditor(user) {
    return user
        && Object.keys(user).length > 0
        && (
            user.admin
                || Object.keys(user.tasks).length > 0
                || Object.keys(user.supervised_tasks).length > 0
                || Object.keys(user.permissions).length > 0
        );
}
