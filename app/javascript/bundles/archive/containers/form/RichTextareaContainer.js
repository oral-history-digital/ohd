import { connect } from 'react-redux';

import RichTextarea from '../../components/form/RichTextarea';


const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RichTextarea);
