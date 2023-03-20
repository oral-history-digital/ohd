import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, fetchData, deleteData, submitData,
    getCurrentUser, getProjectLocales } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        translations: getTranslations(state),
        user: getCurrentUser(state),
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
