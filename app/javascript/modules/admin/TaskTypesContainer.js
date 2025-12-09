import { deleteData, fetchData, getProjects, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataList from './DataList';

const mapStateToProps = (state) => {
    return {
        editView: true,
        scope: 'task_type',
        detailsAttributes: ['key', 'project_id'],
        formElements: [
            {
                attribute: 'label',
                multiLocale: true,
            },
            {
                attribute: 'key',
            },
            {
                attribute: 'abbreviation',
                validate: function (v) {
                    return v?.length > 1;
                },
            },
            {
                elementType: 'input',
                attribute: 'use',
                type: 'checkbox',
            },
            {
                elementType: 'select',
                attribute: 'project_id',
                values: getProjects(state),
                withEmpty: true,
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
