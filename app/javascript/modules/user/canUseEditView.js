export default function canUseEditView(user) {
    if (!user || Object.keys(user).length === 0) {
        return false;
    }

    const result =
        user.admin ||
        Object.keys(user.tasks).length > 0 ||
        Object.keys(user.supervised_tasks).length > 0 ||
        Object.keys(user.permissions).length > 0;

    return result;
}
