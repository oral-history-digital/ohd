import { connect } from 'react-redux';
import PersonData from '../components/PersonData';
import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        archiveId: state.archive.archiveId,
        editView: state.archive.editView,
        interview: interview,
        people: state.data.people,
        contributionTypes: state.archive.contributionTypes,
        account: state.data.accounts.current,
    }
}


export default connect(mapStateToProps)(PersonData);
