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
        let explanation = this.state.explanation || 'introduction'
            return (
                <div>
                    <p className='explanation'>
                        {t(this.props, `upload.explanation.${explanation}`)}
                    </p>
                    {this.downloadLink()}
                </div>
            )
    }

    downloadLink() {
        if (this.state.explanation === 'bulk_metadata') {
            return (<a href={`/metadata-import-template.csv`} download>{`metadata-import-template.csv`}</a>);
        } else if (this.state.explanation === 'bulk_registry_entries') {
            return (<a href={`/registry-entries-import-template.csv`} download>{`registry-entries-import-template.csv`}</a>);
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
                                elementType: 'select',
                                attribute: 'lang',
                                values: this.props.locales,
                                withEmpty: true,
                                validate: function(v){return /\w{2}/.test(v)},
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
        let tabIndex = this.props.locales.length + 4 + this.props.hasMap;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <div className='wrapper-content register'>
                    <AuthShowContainer ifLoggedIn={true}>
                        <h1 className='registry-entries-title'>{t(this.props, `edit.upload.upload`)}</h1>
                        {this.content()}
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                        {t(this.props, 'devise.failure.unauthenticated')}
                    </AuthShowContainer>
                </div>
            </WrapperPageContainer>
        );
    }
}
