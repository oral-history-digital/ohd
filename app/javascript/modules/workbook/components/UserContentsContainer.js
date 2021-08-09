import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import { getWorkbookData } from '../selectors';
import UserContents from './UserContents';


const mapStateToProps = state => ({
    workbookData: getWorkbookData(state),
    locale: getLocale(state),
});

export default connect(mapStateToProps)(UserContents);
