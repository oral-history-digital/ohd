import { getCountryKeys } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { connect } from 'react-redux';

import UsersAdminTabPanel from './UsersAdminTabPanel';

const mapStateToProps = (state) => ({
    project: getCurrentProject(state),
    countryKeys: getCountryKeys(state),
});

export default connect(mapStateToProps)(UsersAdminTabPanel);
