import { connect } from 'react-redux';

import ContributionForm from '../components/ContributionForm';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        contributionTypes: state.archive.contributionTypes,
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
