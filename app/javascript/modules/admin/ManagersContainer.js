import {
    deleteData,
    fetchData,
    getCurrentProject,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataList from './DataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        editView: true,
        data: project.managers,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'manager',
        detailsAttributes: ['name', 'url'],
        initialFormValues: {
            project_id: project.id,
            type: 'Manager',
        },
        formElements: [
            {
                attribute: 'name',
            },
            {
                attribute: 'url',
            },
            {
                attribute: 'name_type',
                elementType: 'select',
                values: ['Organizational', 'Personal'],
                withEmpty: true,
            },
        ],
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
