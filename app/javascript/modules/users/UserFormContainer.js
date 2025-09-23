import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject } from 'modules/data';
import { getLocale, getTranslationsView, getTranslations } from 'modules/archive';
import UserForm from './UserForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    project: getCurrentProject(state),
    translationsView: getTranslationsView(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
