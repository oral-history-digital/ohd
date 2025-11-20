import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentProject } from 'modules/data';
import EditData from './EditData';

const mapStateToProps = (state) => ({
    data: getCurrentProject(state),
    scope: 'project',
    helpTextCode: 'archive_display_form',
    formElements: [
        {
            attribute: 'primary_color',
            elementType: 'colorPicker',
        },
        {
            attribute: 'secondary_color',
            elementType: 'colorPicker',
        },
        {
            attribute: 'editorial_color',
            elementType: 'colorPicker',
        },
        {
            attribute: 'aspect_x',
            validate: function (v) {
                return /^\d+$/.test(v);
            },
        },
        {
            attribute: 'aspect_y',
            validate: function (v) {
                return /^\d+$/.test(v);
            },
        },
    ],
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
