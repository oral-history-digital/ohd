import { getLocale, getProjectId } from 'modules/archive';
import { getProjects, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BiographicalEntryForm from './BiographicalEntryForm';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BiographicalEntryForm);
