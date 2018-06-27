import { connect } from 'react-redux';
import YearRange from '../components/YearRange';
import ArchiveUtils from '../../../lib/utils';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
    }
}


export default connect(mapStateToProps)(YearRange);
