import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SelectInterviewEditViewColumnsFormContainer from '../containers/SelectInterviewEditViewColumnsFormContainer';
import { t } from 'modules/i18n';

class InterviewEditButtons extends Component {
    static propTypes = {
        editViewEnabled: PropTypes.bool.isRequired,
        skipEmptyRows: PropTypes.bool.isRequired,
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        changeToInterviewEditView: PropTypes.func.isRequired,
        setSkipEmptyRows: PropTypes.func.isRequired,
        openArchivePopup: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { editViewEnabled, skipEmptyRows } = this.props;

        return (
            <Fragment>
               {
                    editViewEnabled ?
                        (<Fragment>
                            <button
                                className="IconButton"
                                type="button"
                                title={t(this.props, 'edit_column_header.select_columns')}
                                onClick={() => this.props.openArchivePopup({
                                    title: t(this.props, 'edit_column_header.select_columns'),
                                    content: <SelectInterviewEditViewColumnsFormContainer />
                                })}
                            >
                                <i className="fa fa-fw fa-columns"/>
                            </button>
                            <button
                                className={classNames('IconButton', { 'is-pressed': skipEmptyRows })}
                                type="button"
                                title={t(this.props, `edit_column_header.${skipEmptyRows ? 'skip_rows_off' : 'skip_rows_on'}`)}
                                onClick={() => this.props.setSkipEmptyRows(!skipEmptyRows)}
                            >
                                <i className="fa fa-fw fa-filter" aria-hidden="true"/>
                            </button>
                        </Fragment>) :
                        null
                }
                <button
                    className={classNames('IconButton', { 'is-pressed': editViewEnabled })}
                    type="button"
                    title={t(this.props, `edit_column_header.${editViewEnabled ? 'close_table' : 'open_table'}`)}
                    onClick={() => this.props.changeToInterviewEditView(!editViewEnabled)}
                >
                    <i className="fa fa-fw fa-edit" aria-hidden="true"/>
                </button>
            </Fragment>
        );
    }
}

export default InterviewEditButtons;
