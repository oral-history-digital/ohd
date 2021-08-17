import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { submitData, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import SingleTextInputForm from './SingleTextInputForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    closeArchivePopup,
    // please NO submitData in here: it would disable
    // this form`s functionality
    // as sub-form
    //submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SingleTextInputForm);
