import React from 'react';

import AuthorizedContent from './AuthorizedContent';
import { ArchivePopupButton } from 'modules/ui';
import DataContainer from '../containers/DataContainer';
import { Form } from 'modules/forms';
import { camelcase } from 'lib/utils';
import { t } from 'modules/i18n';

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
        if (!this.props.hideAdd) {
            return (
                <AuthorizedContent object={[{type: camelcase(this.props.scope), action: 'create', interview_id: this.props.interview?.id}, this.props.task]}>
                    <ArchivePopupButton
                        title={t(this.props, `edit.${this.props.scope}.new`)}
                        buttonFaKey='plus'
                    >
                        {this.form()}
                    </ArchivePopupButton>
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
