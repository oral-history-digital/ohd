import React from 'react';
import DataContainer from '../containers/DataContainer';
import Form from '../containers/form/Form';
import { t, admin, camelcase } from '../../../lib/utils';

export default class DataLists extends React.Component {

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
            return Object.keys(this.props.data).map((c, index) => {
                return (
                    <DataContainer
                        data={this.props.data[c]}
                        scope={this.props.scope}
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

    form(data) {
        let _this = this;
        return (
            <Form
                data={data}
                values={this.props.initialFormValues}
                scope={this.props.scope}
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                submitText='submit'
                elements={this.props.formElements}
            />
        );
    }

    add() {
        if (
            (
                admin(this.props, {type: camelcase(this.props.scope), action: 'create', interview_id: this.props.interview && this.props.interview.id}) ||
                // allow commenting onn task
                this.props.task && admin(this.props, this.props.task)
            ) &&
            !this.props.hideAdd
        ) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, `edit.${this.props.scope}.new`)}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, `edit.${this.props.scope}.new`),
                        content: this.form()
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
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
