import { connect } from 'react-redux';

import UserRegistrations from '../components/UserRegistrations';
import { 
    setQueryParams, 
} from '../actions/searchActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        locales: (project && project.locales) || state.archive.locales,
        translations: state.archive.translations,
        userRegistrations: state.data.user_registrations,
        resultPagesCount: state.data.statuses.user_registrations.resultPagesCount,
        query: state.search.user_registrations.query,
        isUserRegistrationSearching: state.search.isUserRegistrationSearching,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrations);
