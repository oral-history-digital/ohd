import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import PersonDetails from './PersonDetails'
import PersonForm from './PersonForm';
import PersonDelete from './PersonDelete';

export default function PersonRowActions({
    row,
}) {
    return (
        <RowActions
            row={row}
            displayComponent={PersonDetails}
            editComponent={PersonForm}
            deleteComponent={PersonDelete}
        />
    );
}

PersonRowActions.propTypes = {
    row: PropTypes.object.isRequired,
};
