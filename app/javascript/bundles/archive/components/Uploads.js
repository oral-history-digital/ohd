import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class Uploads extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showForm: true
        };
        this.handleUploadTypeChange = this.handleUploadTypeChange.bind(this);
        this.returnToForm = this.returnToForm.bind(this);
    }

    handleUploadTypeChange(name, value) {
        this.setState({ 
            explanation: value
        })
    }

    explanations() {
        if (this.state.explanation) {
            return (
                <div>
                    <p className='explanation'>
                        {t(this.props, `upload.explanation.${this.state.explanation}`)}
                    </p>
                    {this.downloadLink(this.state.explanation)}
                </div>
            )
        } else {
            return null;
        }
    }

    downloadLink(explanation) {
        if (explanation === 'bulk_metadata') {
            return (<a href={`/${this.state.explanation}.csv`} download>{`${this.state.explanation}.csv`}</a>);
        } else {
            return null;
        }
    }

    returnToForm() {
        this.setState({showForm: true});
    }

    content() {
        if (
            !this.state.showForm
        ) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.upload.processing')}
                    </p>
                    <button 
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.upload.return')}
                    </button>
                </div>
            )
        } else {
            let _this = this;
            return (
                <div>
                    {this.explanations()}
                    <Form 
                        scope='upload'
                        onSubmit={function(params){_this.props.submitData(_this.props, params); _this.setState({showForm: false})}}
                        submitText='edit.upload.upload'
                        elements={[
                            {
                                elementType: 'select',
                                attribute: 'type',
                                values: this.props.uploadTypes,
                                handlechangecallback: this.handleUploadTypeChange,
                                withEmpty: true,
                                validate: function(v){return v !== ''},
                                individualErrorMsg: 'empty'
                            },
                            { 
                                attribute: 'data',
                                elementType: 'input',
                                type: 'file',
                                validate: function(v){return v instanceof File},
                            },
                        ]}
                    />
                </div>
            )
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 4;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    {this.content()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
