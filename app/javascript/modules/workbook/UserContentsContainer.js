import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import { getUserContents } from 'modules/data';
import UserContents from './UserContents';

const mapStateToProps = state => ({
    contents: getUserContents(state),
    locale: getLocale(state),
});

export default connect(mapStateToProps)(UserContents);
