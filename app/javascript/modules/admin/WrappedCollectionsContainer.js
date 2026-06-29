import {
    deleteData,
    fetchData,
    getCollectionsForCurrentProject,
    getCollectionsStatus,
    getCurrentProject,
    submitData,
} from 'modules/data';
import { getCollectionsQuery, setQueryParams } from 'modules/search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    const collectionsQuery = getCollectionsQuery(state);

    return {
        data: getCollectionsForCurrentProject(state),
        dataStatus: getCollectionsStatus(state),
        resultPagesCount: getCollectionsStatus(state).resultPagesCount,
        query: {
            ...collectionsQuery,
            // Always fetch collections scoped to the current project in admin.
            for_projects: project.id,
        },
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'collection',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        detailsAttributes: [
            'name',
            'homepage',
            'responsibles',
            'notes',
            'doi_status',
        ],
        initialFormValues: { project_id: project.id },
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
                baseLocales: ['de', 'en'],
            },
            {
                attribute: 'shortname',
            },
            {
                attribute: 'publication_date',
                validate: function (v) {
                    return /^\d{4}$/.test(v);
                },
            },
            {
                attribute: 'homepage',
                multiLocale: true,
                baseLocales: ['de', 'en'],
            },
            {
                attribute: 'responsibles',
                multiLocale: true,
                baseLocales: ['de', 'en'],
                elementType: 'textarea',
                htmlOptions: { maxLength: 255 },
            },
            {
                attribute: 'notes',
                multiLocale: true,
                baseLocales: ['de', 'en'],
                elementType: 'richTextEditor',
            },
        ],
        hideRegisterDoiAction: false,
        joinedData: {},
        helpTextCode: 'collection_form',
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
            setQueryParams,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
