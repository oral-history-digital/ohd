import {
    deleteData,
    fetchData,
    getCurrentProject,
    getInstitutions,
    getStatuses,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataList from './DataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);

    return {
        editView: true,
        data: project.institution_projects,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'institution_project',
        statuses: getStatuses(state),
        otherDataToLoad: ['institution'],
        detailsAttributes: ['name', 'shortname'],
        initialFormValues: { project_id: project.id },
        formElements: [
            {
                attribute: 'institution_id',
                elementType: 'select',
                values: getInstitutions(state),
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
