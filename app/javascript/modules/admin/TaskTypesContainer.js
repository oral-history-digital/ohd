import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, fetchData, deleteData, submitData, getProjects, getCurrentAccount } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        project: getCurrentProject(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: true,
        //
        scope: 'task_type',
        detailsAttributes: [
            "key",
            "project_id",
        ],
        formElements: [
            {
                attribute: 'label',
                multiLocale: true,
            },
            {
                attribute: 'key',
            },
            {
                attribute: 'abbreviation',
                validate: function(v){return v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'use',
                type: 'checkbox',
            },
            {
                elementType: 'select',
                attribute: 'project_id',
                values: getProjects(state),
                withEmpty: true,
            },
        ],
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
