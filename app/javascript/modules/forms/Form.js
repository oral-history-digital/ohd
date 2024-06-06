import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import FormComponent from './FormComponent';

const mapStateToProps = state => ({
    locale: getLocale(state),
});

export default connect(mapStateToProps)(FormComponent);
