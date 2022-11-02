import { Component } from 'react';
import { Helmet } from 'react-helmet';

import { AuthShowContainer } from 'modules/auth';
import { Form } from 'modules/forms';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';

export default class Uploads extends Component {

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
            return (<a href={`${pathBase(this.props)}/metadata-import-template.csv`} download>{`metadata-import-template.csv`}</a>);
        } else if (this.state.explanation === 'bulk_registry_entries') {
            return (<a href={`/registry-entries-import-template.csv`} download>{`registry-entries-import-template.csv`}</a>);
        } else if (this.state.explanation === 'bulk_photos') {
            return (<a href={`/photos-import-template.csv`} download>{`photos-import-template.csv`}</a>);
        } else {
            return null;
        }
    }

    returnToForm() {
        this.setState({showForm: true});
    }

    content() {
        if (
            admin(this.props, {type: 'Upload'}, 'create')
        ) {
            if (
                !this.state.showForm
            ) {
                return (
                    <div>
                        <p>
                            {t(this.props, 'edit.upload.processing')}
                        </p>
                        <button
                            type="button"
                            className='Button return-to-upload'
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
                            helpTextCode="import_form"
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
    }

    render() {
        return (
            <div className='wrapper-content register'>
                <Helmet>
                    <title>{t(this.props, `edit.upload.upload`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className='registry-entries-title'>{t(this.props, `edit.upload.upload`)}</h1>
                    {this.content()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        );
    }
}
