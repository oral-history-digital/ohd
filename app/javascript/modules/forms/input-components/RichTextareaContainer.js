import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import RichTextarea from './RichTextarea';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
    }
}

export default connect(mapStateToProps)(RichTextarea);
