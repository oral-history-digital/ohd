import { connect } from 'react-redux';

import AssignSpeakersForm from '../components/AssignSpeakersForm';
import { fetchData, submitData, returnToForm } from '../actions/dataActionCreators';
import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        archiveId: state.archive.archiveId,
        translations: state.archive.translations,
        account: state.account,
        processing: state.data.statuses.initials.processing, 
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        initialsStatus: state.data.statuses.initials,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    submitData: (params) => dispatch(submitData(params)),
    returnToForm: (dataType) => dispatch(returnToForm(dataType))
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignSpeakersForm);
