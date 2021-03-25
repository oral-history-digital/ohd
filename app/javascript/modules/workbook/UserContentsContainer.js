import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import UserContents from './UserContents';

const mapStateToProps = state => ({
    contents: state.data.user_contents,
    status: state.data.statuses.user_contents.lastModified,
    locale: getLocale(state),
});

export default connect(mapStateToProps)(UserContents);
