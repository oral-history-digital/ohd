import { connect } from 'react-redux';

import Interview from '../components/Interview';
import { fetchData } from '../actions/dataActionCreators';
import { fetchUserContents } from '../actions/userContentActionCreators';
import { setArchiveId } from '../actions/archiveActionCreators';

//import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        account: state.account,
        interviews: state.data.interviews,
        userContents: state.data.user_contents,
        userContentsStatus: state.data.user_contents_status,
        people: state.data.people,
        people_status: state.data.people_status,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchUserContents: () => dispatch(fetchUserContents()),
    fetchData: (dataType, id, nestedDataType) => dispatch(fetchData(dataType, id, nestedDataType)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
