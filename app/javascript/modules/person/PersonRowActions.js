import { RowActions } from 'modules/tables';
import PropTypes from 'prop-types';

import PersonDelete from './PersonDelete';
import PersonDetails from './PersonDetails';
import PersonForm from './PersonForm';

export default function PersonRowActions({ row }) {
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
