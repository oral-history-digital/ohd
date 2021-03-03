import { connect } from 'react-redux';

import { getTreeSelectEnabled } from 'modules/features';
import { getLocale, getTranslations } from 'modules/archive';
import FormComponent from './FormComponent';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    treeSelectEnabled: getTreeSelectEnabled(state),
});

export default connect(mapStateToProps)(FormComponent);
