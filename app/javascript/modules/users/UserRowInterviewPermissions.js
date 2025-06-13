import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import InterviewPermissionForm from './InterviewPermissionForm';
import { useI18n } from 'modules/i18n';

export default function UserRowActions({
    row,
    getValue,
}) {
    const { t } = useI18n();
    const dataPath = getValue();

    const none = !row.original.interview_permissions || row.original.interview_permissions.length === 0
    const names = row.original.interview_permissions.map(i => i.name).slice(0, 3).join(', ');
    const hasMore = row.original.interview_permissions.length > 3;

    return (
        <>
            <span>{!none && `${row.original.interview_permissions.length} ${t('activerecord.models.interview_permission.other')}: `}</span>
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

