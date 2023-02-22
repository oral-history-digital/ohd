import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { ErrorBoundary } from 'modules/react-toolbox';
import { AuthorizedContent } from 'modules/auth';
import { Modal } from 'modules/ui';
import { Form } from 'modules/forms';
import { camelCase } from 'modules/strings';
import { t } from 'modules/i18n';
import DataContainer from './DataContainer';
import EditViewOrRedirect from './EditViewOrRedirect';

export default class DataList extends Component {

    constructor(props) {
        super(props);
        this.form = this.form.bind(this);
    }

    componentDidMount() {
        this.loadJoinData();
    }

    loadJoinData() {
         if (
            this.props.joinDataStatus && !(
                this.props.joinDataStatus[`for_projects_${this.props.project?.id}`] ||
                this.props.joinDataStatus.all
            )
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
                        outerScope={this.props.outerScope}
                        outerScopeId={this.props.outerScopeId}
                        optionsScope={this.props.optionsScope}
                        detailsAttributes={this.props.detailsAttributes}
                        joinedData={this.props.joinedData}
                        form={this.form}
                        showComponent={this.props.showComponent}
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

    form(data, onSubmit, onCancel) {
        if (this.props.form) {
            return createElement(this.props.form, {data: data, values: this.props.initialFormValues, onSubmit: onSubmit});
        } else {
            return (
                <Form
                    data={data}
                    values={this.props.initialFormValues}
                    scope={this.props.scope}
                    helpTextCode={this.props.helpTextCode}
                    onSubmit={(params) => {
                        this.props.submitData(this.props, params);
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                    onCancel={onCancel}
                    submitText='submit'
                    elements={this.props.formElements}
                />
            );
        }
    }

    add() {
        if (!this.props.hideAdd) {
            return (
                <AuthorizedContent object={[{type: camelCase(this.props.scope), interview_id: this.props.interview?.id}, this.props.task]} action='create'>
                    <Modal
                        title={t(this.props, `edit.${this.props.scope}.new`)}
                        trigger={<><FaPlus className="Icon Icon--editorial"/> {t(this.props, `edit.${this.props.scope}.new`)}</>}
                    >
                        {close => this.form(undefined, close, close)}
                    </Modal>
                </AuthorizedContent>
            )
        }
    }

    render() {
        return (
            <EditViewOrRedirect>
                <div>
                    <ErrorBoundary>
                        {this.data()}
                        {this.add()}
                    </ErrorBoundary>
                </div>
            </EditViewOrRedirect>
        );
    }
}

DataList.propTypes = {
    helpTextCode: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
};
