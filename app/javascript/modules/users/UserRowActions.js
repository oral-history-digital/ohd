import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import UserEdit from './UserEdit';

export default function UserRowActions({
    row,
}) {
    return (
        <RowActions
            row={row}
            editComponent={UserEdit}
        />
    );
}

UserRowActions.propTypes = {
    row: PropTypes.object.isRequired,
};
