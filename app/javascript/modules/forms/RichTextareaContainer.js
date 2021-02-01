import { connect } from 'react-redux';

import RichTextarea from './RichTextarea';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

export default connect(mapStateToProps)(RichTextarea);
