import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import UserEdit from './UserEdit';

export default function UserRowActions({
    row,
    getValue,
}) {
    const dataPath = getValue();
    return (
        <RowActions
            row={row}
            dataPath={dataPath}
            editComponent={UserEdit}
        />
    );
}

UserRowActions.propTypes = {
    row: PropTypes.object.isRequired,
};
