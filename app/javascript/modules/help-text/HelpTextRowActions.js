import { RowActions } from 'modules/tables';
import PropTypes from 'prop-types';

import HelpTextDisplay from './HelpTextDisplay';
import HelpTextForm from './HelpTextForm';

export default function HelpTextRowActions({ row }) {
    return (
        <RowActions
            row={row}
            displayComponent={HelpTextDisplay}
            editComponent={HelpTextForm}
        />
    );
}

HelpTextRowActions.propTypes = {
    row: PropTypes.object.isRequired,
};
