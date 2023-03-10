import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, fetchData, deleteData, submitData, getProjects, getCurrentAccount } from 'modules/data';
import { DataList } from 'modules/admin';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';

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
        scope: 'comment',
        detailsAttributes: ['created_at', 'text'],
        formElements: [
            {
                attribute: 'text',
                elementType: 'textarea',
            },
        ]
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
