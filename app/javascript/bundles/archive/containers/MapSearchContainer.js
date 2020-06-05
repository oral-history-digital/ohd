import { connect } from 'react-redux';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import MapSearch from '../components/MapSearch';
import { searchInMap } from '../actions/searchActionCreators';
import { setViewMode } from '../actions/archiveActionCreators';
import { getCookie } from '../../../lib/utils';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        foundMarkers: state.search.map.foundMarkers,
        query: state.search.map.query,
        translations: state.archive.translations,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        isMapSearching: state.search.isMapSearching,
        project: project,
        projectId: state.archive.projectId,
        editView: state.archive.editView,
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    searchInMap: (url, query) => dispatch(searchInMap(url, query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MapSearch);


