import { connect } from 'react-redux';
import Carousel from '../components/Carousel';
import { getInterview } from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        archiveId: state.archive.archiveId,
        editView: state.archive.editView,
        translations: state.archive.translations,
        account: state.account,
        interview: getInterview(state),
        project: state.archive.project,
    }
}


export default connect(mapStateToProps)(Carousel);
