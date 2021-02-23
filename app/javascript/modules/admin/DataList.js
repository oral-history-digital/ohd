import React from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { Modal } from 'modules/ui';
import { Form } from 'modules/forms';
import { camelCase } from 'modules/strings';
import { t } from 'modules/i18n';
import DataContainer from './DataContainer';

export default class DataList extends React.Component {

    constructor(props) {
        super(props);
        this.form = this.form.bind(this);
    }

    componentDidMount() {
        this.loadJoinData();
    }

    loadJoinData() {
         if (
            this.props.joinDataStatus && !this.props.joinDataStatus.all
         ) {
            this.props.fetchData(this.props, this.props.joinDataScope, null, null, null);
         }
     }

    data() {
        if (this.props.data) {
            return Object.keys(this.props.data).map((c) => {
                return (
                    <DataContainer
                        data={this.props.data[c]}
                        scope={this.props.scope}
                        optionsScope={this.props.optionsScope}
                        detailsAttributes={this.props.detailsAttributes}
                        joinedData={this.props.joinedData}
                        form={this.form}
                        hideShow={this.props.hideShow}
                        hideEdit={this.props.hideEdit}
                        hideDelete={this.props.hideDelete}
                        editView={this.props.editView}
                        task={this.props.task}
                        key={`${this.props.scope}-${c}`}
                    />
                )
            })
        } else {
            return null;
        }
    }

    form(data, onSubmit) {
        if (this.props.form) {
            return React.createElement(this.props.form, {data: data});
        } else {
            return (
                <Form
                    data={data}
                    values={this.props.initialFormValues}
                    scope={this.props.scope}
                    onSubmit={(params) => {
                        this.props.submitData(this.props, params);
                        this.props.closeArchivePopup();
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                    submitText='submit'
                    elements={this.props.formElements}
                />
            );
        }
    }

    add() {
        if (!this.props.hideAdd) {
            return (
                <AuthorizedContent object={[{type: camelCase(this.props.scope), action: 'create', interview_id: this.props.interview?.id}, this.props.task]}>
                    <Modal
                        title={t(this.props, `edit.${this.props.scope}.new`)}
                        trigger={<><i className="fa fa-plus"/> {t(this.props, `edit.${this.props.scope}.new`)}</>}
                    >
                        {close => this.form(undefined, close)}
                    </Modal>
                </AuthorizedContent>
            )
        }
    }

    render() {
        return (
            <div>
                {this.data()}
                {this.add()}
            </div>
        );
    }
}

DataList.propTypes = {
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
};
