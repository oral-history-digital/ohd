import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import { getUserContents, getUserContentsStatus } from 'modules/data';
import UserContents from './UserContents';

const mapStateToProps = state => ({
    contents: getUserContents(state),
    status: getUserContentsStatus(state).lastModified,
    locale: getLocale(state),
});

export default connect(mapStateToProps)(UserContents);
