import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import UserRegistrationProjectFormContainer from './UserRegistrationProjectFormContainer';

export default function UserRowActions({
    row,
}) {
    return (
        <RowActions
            row={row}
            editComponent={UserRegistrationProjectFormContainer}
        />
    );
}

UserRowActions.propTypes = {
    row: PropTypes.object.isRequired,
};
