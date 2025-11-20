import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getCurrentProject,
    getProjectLocales,
    fetchData,
    deleteData,
    submitData,
} from 'modules/data';
import DataList from './DataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        editView: true,
        data: project.sponsor_logos,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'sponsor_logo',
        detailsAttributes: ['src', 'locale'],
        initialFormValues: {
            ref_id: project.id,
            ref_type: 'Project',
            type: 'SponsorLogo',
        },
        formElements: [
            {
                attribute: 'locale',
                elementType: 'select',
                values: getProjectLocales(state),
                withEmpty: true,
            },
            {
                attribute: 'file',
                elementType: 'input',
                type: 'file',
            },
            {
                attribute: 'href',
            },
            {
                attribute: 'title',
            },
        ],
        helpTextCode: 'sponsor_logo_form',
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
