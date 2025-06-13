import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import InterviewPermissionForm from './InterviewPermissionForm';

export default function UserRowActions({
    row,
    getValue,
}) {
    const dataPath = getValue();
    return (
        <>
            {row.original.interview_permissions.map((interviewPermission) => (
                <span key={interviewPermission.id}>
                    {interviewPermission.name}, &nbsp;
                </span>
            ))}
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

