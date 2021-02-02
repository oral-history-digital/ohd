import { connect } from 'react-redux';

import UserContents from './UserContents';

const mapStateToProps = state => ({
    contents: state.data.user_contents,
    status: state.data.statuses.user_contents.lastModified,
    locale: state.archive.locale,
});

export default connect(mapStateToProps)(UserContents);
