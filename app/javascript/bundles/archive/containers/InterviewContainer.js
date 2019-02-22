import { connect } from 'react-redux';

import Interview from '../components/Interview';
import { fetchData } from '../actions/dataActionCreators';
import { setArchiveId } from '../actions/archiveActionCreators';

//import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        interviews: state.data.interviews,
        interviewsStatus: state.data.statuses.interviews,
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        doiContentsStatus: state.data.statuses.doi_contents,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
