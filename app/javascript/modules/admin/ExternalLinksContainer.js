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
        data: project.external_links,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'external_link',
        detailsAttributes: ['name', 'url'],
        initialFormValues: { project_id: project.id },
        formElements: [
            {
                attribute: 'internal_name',
            },
            {
                attribute: 'name',
                multiLocale: true,
            },
            {
                attribute: 'url',
                multiLocale: true,
            },
        ],
        helpTextCode: 'external_link_form',
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
