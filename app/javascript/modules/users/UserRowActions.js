import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import UserRegistrationProjectFormContainer from './UserRegistrationProjectFormContainer';
import UserRegistrationContainer from './UserRegistrationContainer';

export default function UserRowActions({
    row,
}) {
    return (
        <RowActions
            row={row}
            displayComponent={UserRegistrationContainer}
            editComponent={UserRegistrationProjectFormContainer}
        />
    );
}

UserRowActions.propTypes = {
    row: PropTypes.object.isRequired,
};
