import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, fetchData, deleteData, submitData, getProjects,
    getCurrentAccount, getProjectLocales } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: true,
        scope: 'logo',
        detailsAttributes: ['src', 'locale'],
        formElements: [
            {
                attribute: "locale",
                elementType: 'select',
                values: getProjectLocales(state),
                withEmpty: true,
            },
            {
                attribute: 'file',
                elementType: 'input',
                type: 'file',
            },
        ],
        helpTextCode: 'logo_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
