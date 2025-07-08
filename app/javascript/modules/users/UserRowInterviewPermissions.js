import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import InterviewPermissionForm from './InterviewPermissionForm';
import { useI18n } from 'modules/i18n';
import useRestrictedInterviews from './useRestrictedInterviews';

export default function UserRowActions({
    row,
    getValue,
}) {
    const { t } = useI18n();
    const dataPath = getValue();
    const { interviews } = useRestrictedInterviews();

    const currentProjectInterviewPermissions = row.original.interview_permissions?.filter(permission => {
        return interviews?.some(interview => interview.id === permission.interview_id);
    });
    const none = !currentProjectInterviewPermissions || currentProjectInterviewPermissions.length === 0
    const names = currentProjectInterviewPermissions?.sort((a,b) =>
            a.archive_id.localeCompare(b.archive_id, undefined, { numeric: true })
        ).map(i => i.archive_id).slice(0, 3).join(', ');
    const hasMore = currentProjectInterviewPermissions.length > 3;

    return (
        interviews?.length === 0 ? null :
        <>
            <span>{!none && `${currentProjectInterviewPermissions.length} ${t('activerecord.models.interview_permission.other')}: `}</span>
            <span>
                {!none && names}
                {hasMore && '...'}
            </span>
            <RowActions
                row={row}
                dataPath={dataPath}
                editComponent={InterviewPermissionForm}
            />
        </>
    );
}

UserRowActions.propTypes = {
    row: PropTypes.object.isRequired,
};

