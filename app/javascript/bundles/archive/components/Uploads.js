import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class Uploads extends React.Component {

    constructor(props) {
        super(props);
        this.state = { };
        this.handleUploadTypeChange = this.handleUploadTypeChange.bind(this);
    }

    handleUploadTypeChange(name, value) {
        this.setState({ 
            explanation: value
        })
    }

    explanations() {
        if (this.state.explanation) {
            return (
                <p className='explanation'>
                    {t(this.props, `upload.explanation.${this.state.explanation}`)}
                </p>
            )
        } else {
            return null;
        }
    }

    returnToForm() {
        this.props.returnToForm('uploads');
    }

    content() {
        if (
            this.props.processing 
        ) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.upload.processing')}
                        {this.props.processing}
                    </p>
                    <div 
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.upload.return')}
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {this.explanations()}
                    <Form 
                        scope='upload'
                        onSubmit={this.props.submitData}
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
        let tabIndex = this.props.locales.length + 5;
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
