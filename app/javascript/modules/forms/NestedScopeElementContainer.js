import { getLocale, getProjectId } from 'modules/archive';
import { deleteData, getCurrentProject, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NestedScopeElement from './NestedScopeElement';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            deleteData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(NestedScopeElement);
