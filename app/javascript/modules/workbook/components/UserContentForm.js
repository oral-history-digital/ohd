import { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';
import { CopyLink } from 'modules/ui';
import { formatTimecode } from 'modules/interview-helpers';

export default class UserContentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            title: this.props.title,
            description: this.props.description,
            properties: this.props.properties,
            reference_id: this.props.reference_id,
            reference_type: this.props.reference_type,
            media_id: this.props.media_id,
            type: this.props.type,
            segmentIndex: this.props.segmentIndex,
            workflow_state: this.props.workflow_state,
            shared: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({[name]: value});
        if (this.valid()) {
            this.clearErrors();
        }
    }

    handleSubmit(event) {
        const { projectId, projects, locale, createWorkbook, updateWorkbook, onSubmit } = this.props;
        const { id } = this.state;

        event.preventDefault();
        if (this.valid()) {
            if (id) {
                updateWorkbook(pathBase({ locale, projectId, projects }), id, {user_content: this.state})
            } else {
                createWorkbook(pathBase({ locale, projectId, projects }), {user_content: this.state})
            }
            onSubmit();
        } else {
            this.setErrors();
        }
    }

    valid() {
        return this.state.title &&
            this.state.title.length > 1
    }

    setErrors() {
        const { locale, translations } = this.props;

        this.setState({errors: t({ locale, translations }, 'user_content_errors')});
    }

    clearErrors() {
        this.setState({errors: undefined});
    }

    positionUrl() {
        const { locale, projectId, projects, properties } = this.props;

        const protocol = window.location.protocol;
        const host = window.location.host;
        const pathBaseStr = pathBase({ locale, projectId, projects });
        const interviewId = properties.interview_archive_id;
        const tape = properties.tape_nbr;
        const time = formatTimecode(properties.time, true);

        return `${protocol}//${host}${pathBaseStr}/interviews/${interviewId}?tape=${tape}&time=${time}`;
    }

    render() {
        const { type, locale, translations, onCancel } = this.props;

        let submitLabel = this.props.submitLabel ? this.props.submitLabel : t(this.props, 'save');

        return (
            <div>
                <div className='errors'>{this.state.errors}</div>
                <form
                    className='Form default'
                    onSubmit={this.handleSubmit}
                >
                    <div className="form-group">
                        <label className="publish-label">
                            {t({ locale, translations }, 'title')}
                        </label>
                        <input type="text" name='title' value={this.state.title} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label className="publish-label">
                            {t({ locale, translations }, 'modules.workbook.note')}
                        </label>
                        <textarea name='description' value={this.state.description} onChange={this.handleChange}/>
                    </div>

                    {type==='UserAnnotation' && (
                        <div className="u-mb">
                            <h4 className="u-line-height u-mt-none u-mb-none">
                                {t({ locale, translations }, 'modules.workbook.segment_link')}
                            </h4>
                            {this.positionUrl()}
                            {' '}
                            <CopyLink
                                className="Icon--primary"
                                url={this.positionUrl()}
                            />
                        </div>
                    )}

                    <div className="Form-footer">
                        <input
                            className="Button Button--primaryAction"
                            type="submit"
                            value={submitLabel}
                        />
                        {typeof onCancel === 'function' && (
                            <button
                                type="button"
                                className="Button Button--secondaryAction"
                                onClick={onCancel}
                            >
                                {t({ locale, translations }, 'cancel')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        );
    }
}

UserContentForm.propTypes = {
    type: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    createWorkbook: PropTypes.func.isRequired,
    updateWorkbook: PropTypes.func.isRequired,
};
