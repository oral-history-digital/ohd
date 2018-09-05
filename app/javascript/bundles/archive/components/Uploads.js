import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class Uploads extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let tabIndex = this.props.locales.length + 6;
        let _this = this;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    <Form 
                        scope='upload'
                        onSubmit={this.props.submitData}
                        submitText='edit.upload.upload'
                        elements={[
                            {
                                elementType: 'select',
                                attribute: 'type',
                                values: this.props.uploadTypes,
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
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
