import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, deleteData, submitData } from 'modules/data';
import { DataList } from 'modules/admin';

const mapStateToProps = (state) => {
    return {
        editView: true,
        scope: 'comment',
        detailsAttributes: ['created_at', 'text'],
        formElements: [
            {
                attribute: 'text',
                elementType: 'textarea',
            },
        ],
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
