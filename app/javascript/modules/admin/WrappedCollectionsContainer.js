import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getCollectionsQuery } from 'modules/search';
import {
    fetchData, deleteData, submitData, getCurrentProject,
    getCollectionsForCurrentProject, getCollectionsStatus
} from 'modules/data';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        data: getCollectionsForCurrentProject(state),
        dataStatus: getCollectionsStatus(state),
        resultPagesCount: getCollectionsStatus(state).resultPagesCount,
        query: getCollectionsQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'collection',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        detailsAttributes: ['name', 'homepage', 'responsibles', 'notes'],
        initialFormValues: { project_id: project.id },
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
            },
            {
                attribute: 'shortname',
            },
            {
                attribute: 'publication_date',
                validate: function(v){return /^\d{4}$/.test(v)},
            },
            {
                attribute: 'homepage',
                multiLocale: true,
            },
            {
                attribute: 'responsibles',
                multiLocale: true,
                elementType: 'textarea',
                htmlOptions: { maxLength: 255 }
            },
            {
                attribute: 'notes',
                multiLocale: true,
                elementType: 'richTextEditor',
            }
        ],
        joinedData: {},
        helpTextCode: 'collection_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
