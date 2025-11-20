import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NestedScopeElement from './NestedScopeElement';
import { submitData, deleteData, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';

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
