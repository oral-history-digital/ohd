import { DataList } from 'modules/admin';
import { deleteData, fetchData, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
