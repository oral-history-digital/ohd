import { connect } from 'react-redux';

import { getLocale, getLocales, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { setQueryParams } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getPeople } from 'modules/data';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        data: getPeople(state),
        dataStatus: state.data.statuses.people,
        resultPagesCount: state.data.statuses.people.resultPagesCount,
        query: state.search.people.query,
        scope: 'person',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        baseTabIndex: 4 + project.has_map,
        //detailsAttributes: ['name'],
        detailsAttributes: ['first_name', 'last_name', 'birth_name', 'alias_names', 'other_first_names', 'date_of_birth', 'typology'],
        formElements: [
            {
                elementType: 'select',
                attribute: 'gender',
                values: ['male', 'female', 'diverse'],
                optionsScope: 'gender',
                withEmpty: true,
                //validate: function(v){return v !== ''}
            },
            {
                attribute: 'first_name',
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
            {
                attribute: 'last_name',
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
            {
                attribute: 'birth_name',
                multiLocale: true,
            },
            {
                attribute: 'alias_names',
                multiLocale: true,
            },
            {
                attribute: 'other_first_names',
                multiLocale: true,
            },
            {
                attribute: 'date_of_birth',
            },
        ],
        joinedData: { },
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
