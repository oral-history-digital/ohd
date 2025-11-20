import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    fetchData,
    deleteData,
    submitData,
    getProjectLocales,
} from 'modules/data';
import DataList from './DataList';

const mapStateToProps = (state) => {
    return {
        editView: true,
        scope: 'logo',
        detailsAttributes: ['src', 'locale'],
        formElements: [
            {
                attribute: 'locale',
                elementType: 'select',
                values: getProjectLocales(state),
                withEmpty: true,
            },
            {
                attribute: 'file',
                elementType: 'input',
                type: 'file',
            },
        ],
        helpTextCode: 'logo_form',
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
