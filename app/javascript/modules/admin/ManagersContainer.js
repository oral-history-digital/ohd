import {
    deleteData,
    fetchData,
    getCurrentProject,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AffiliateForm from './AffiliateForm';
import AffiliateShow from './AffiliateShow';
import DataList from './DataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        editView: true,
        data: project.managers,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'manager',
        detailsAttributes: ['name', 'first_name', 'last_name'],
        initialFormValues: {
            project_id: project.id,
            type: 'Manager',
        },
        form: AffiliateForm,
        showComponent: AffiliateShow,
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
