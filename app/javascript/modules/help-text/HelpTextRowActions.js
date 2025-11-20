import PropTypes from 'prop-types';

import { RowActions } from 'modules/tables';
import HelpTextForm from './HelpTextForm';
import HelpTextDisplay from './HelpTextDisplay';

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
