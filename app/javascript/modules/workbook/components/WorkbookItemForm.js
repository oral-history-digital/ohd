import { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';
import { formatTimecode } from 'modules/interview-helpers';
import CitationInfo from './CitationInfo';
import SegmentLink from './SegmentLink';

export default class WorkbookItemForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            title: this.props.title || this.defaultTitle(),
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

    defaultTitle() {
        const { type, interview, properties, locale, translations } = this.props;

        const name = interview.anonymous_title?.[locale];
        const interviewStr = t({ locale, translations }, 'activerecord.models.interview.one');
        const archiveId = interview.archive_id;
        const tapeStr = t({ locale, translations }, 'tape');

        switch (type) {
        case 'Search':
        case 'UserAnnotation':
            return `${name}, ${interviewStr} ${archiveId}, ${tapeStr} ${properties.tape_nbr} – ${formatTimecode(properties.time)}`;
        case 'InterviewReference':
        default:
            return `${name}, ${interviewStr} ${archiveId}`;
        }
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
                updateWorkbook(pathBase({ locale, projectId, project }), id, {user_content: this.state})
            } else {
                createWorkbook(pathBase({ locale, projectId, project }), {user_content: this.state})
            }
            onSubmit();
        } else {
            this.setErrors();
        }
    }

    valid() {
        return this.state.title?.length > 1
    }

    setErrors() {
        const { locale, translations } = this.props;

        this.setState({errors: t({ locale, translations }, 'user_content_errors')});
    }

    clearErrors() {
        this.setState({errors: undefined});
    }


    render() {
        const { type, locale, translations, properties,
            interview, project, onCancel } = this.props;

        let submitLabel = this.props.submitLabel ? this.props.submitLabel : t(this.props, 'save');

        return (
            <div>
                <div className='errors'>{this.state.errors}</div>
                <form
                    className='Form default'
                    onSubmit={this.handleSubmit}
                >
                    <div className="form-group">
                        <label className="publish-label" htmlFor="workbook_item_form_title">
                            {t({ locale, translations }, 'title')}
                        </label>
                        <input
                            id="workbook_item_form_title"
                            type="text"
                            name="title"
                            required
                            value={this.state.title}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="publish-label" htmlFor="workbook_item_form_description">
                            {t({ locale, translations }, 'modules.workbook.note')}
                        </label>
                        <textarea
                            id="workbook_item_form_description"
                            name="description"
                            maxLength={300}
                            value={this.state.description}
                            onChange={this.handleChange}
                        />
                    </div>

                    {type === 'InterviewReference' && (
                        <CitationInfo
                            interview={interview}
                            project={project}
                            className="u-mb"
                        />
                    )}

                    {type === 'UserAnnotation' && (
                        <>
                            <SegmentLink
                                interviewId={properties.interview_archive_id}
                                tape={properties.tape_nbr}
                                time={properties.time}
                                className="u-mb"
                            />
                            <CitationInfo
                                interview={interview}
                                project={project}
                                tape={properties.tape_nbr}
                                time={properties.time}
                                className="u-mb"
                            />
                        </>
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

WorkbookItemForm.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    properties: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    submitLabel: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    createWorkbook: PropTypes.func.isRequired,
    updateWorkbook: PropTypes.func.isRequired,
};
