import { connect } from 'react-redux';

import { submitData } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import RegistryHierarchyForm from './RegistryHierarchyForm';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        languages: state.data.languages,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryHierarchyForm);