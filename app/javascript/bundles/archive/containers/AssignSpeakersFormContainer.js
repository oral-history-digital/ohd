import { connect } from 'react-redux';

import AssignSpeakersForm from '../components/AssignSpeakersForm';
import { fetchData, submitData } from '../actions/dataActionCreators';
import { getInterview, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        speakerDesignationsStatus: state.data.statuses.speaker_designations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    submitData: (params) => dispatch(submitData(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignSpeakersForm);
