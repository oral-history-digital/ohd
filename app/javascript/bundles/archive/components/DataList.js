import React from 'react';
//import Observer from 'react-intersection-observer'
import DataContainer from '../containers/DataContainer';
import Form from '../containers/form/Form';
import { t, admin, pluralize, parametrizedQuery } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class WrappedDataLists extends React.Component {

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
            this.props.fetchData(this.props.joinDataScope, null, null, this.props.locale, null);
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
                        form={this.form}
                        hideEdit={this.props.hideEdit}
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
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                submitText='submit'
                elements={this.props.formElements}
            />
        );
    }

    add() {
        if (admin(this.props)) {
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
