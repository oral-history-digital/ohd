import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import { getUserContents } from 'modules/data';
import UserContents from './UserContents';

const mapStateToProps = state => ({
    contents: getUserContents(state),
    status: state.data.statuses.user_contents.lastModified,
    locale: getLocale(state),
});

export default connect(mapStateToProps)(UserContents);
