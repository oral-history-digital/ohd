import { useEffect } from 'react';

import { useI18n } from 'modules/i18n';

export default function Account ({
    user,
    editViewCookie,
    changeToEditView,
}) {

    const { t } = useI18n();

    useEffect(() => {
        changeToEditView(editViewCookie)
    }, [editViewCookie]);

    if (
        user && Object.keys(user).length > 0 && (
            user.admin ||
            Object.keys(user.tasks).length > 0 ||
            Object.keys(user.supervised_tasks).length > 0 ||
            Object.keys(user.permissions).length > 0
        )
    ) {
        return (
            <button
                type="button"
                className="Button Button--transparent switch switch-light"
                onClick={() => changeToEditView(!editViewCookie) }
            >
                <span className={`switch-input ${editViewCookie ? 'checked' : ''}`} type="checkbox" />
                <span className="switch-label" data-on={t('admin.change_to_edit_view')} data-off={t('admin.change_to_edit_view')}></span>
                <span className="switch-handle"></span>
            </button>
        )
    } else {
        return null;
    }
}

