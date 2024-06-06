import { useState } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { formatTimecode } from 'modules/interview-helpers';
import CitationInfo from './CitationInfo';
import SegmentLink from './SegmentLink';

export default function WorkbookItemForm({
    id,
    title,
    description,
    properties,
    reference_id,
    reference_type,
    media_id,
    type,
    segmentIndex,
    workflow_state,
    shared,
    interview,
    submitLabel,
    createWorkbook,
    updateWorkbook,
    onSubmit,
    onCancel,
}) {
    const { project } = useProject();
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const [formState, setFormState] = useState({
        id,
        title: title || defaultTitle(),
        description,
        properties,
        reference_id,
        reference_type,
        media_id,
        type,
        segmentIndex,
        workflow_state,
        shared,
    });

    function defaultTitle() {
        const name = interview.anonymous_title?.[locale];
        const interviewStr = t('activerecord.models.interview.one');
        const archiveId = interview.archive_id;
        const tapeStr = t('tape');

        switch (type) {
        case 'Search':
            return `${t('modules.workbook.full_text_search')} ${properties.fulltext}`;
        case 'UserAnnotation':
            return `${name}, ${interviewStr} ${archiveId}, ${tapeStr} ${properties.tape_nbr} – ${formatTimecode(properties.time)}`;
        case 'InterviewReference':
        default:
            return `${name}, ${interviewStr} ${archiveId}`;
        }
    }

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (valid()) {
            clearErrors();
        }
    }

    function handleSubmit(event) {
        const { id } = formState;

        event.preventDefault();
        if (valid()) {
            if (id) {
                updateWorkbook(pathBase, id, {user_content: formState});
            } else {
                createWorkbook(pathBase, {user_content: formState});
            }
            onSubmit();
        } else {
            setErrors();
        }
    }

    function valid() {
        return formState.title?.length > 1;
    }

    function setErrors() {
        setFormState((prev) => ({
            ...prev,
            errors: t('user_content_errors'),
        }));
    }

    function clearErrors() {
        setFormState((prev) => ({
            ...prev,
            errors: null,
        }));
    }

    const actualSubmitLabel = submitLabel ? submitLabel : t('save');

    return (
        <div>
            <div className='errors'>{formState.errors}</div>
            <form
                className='Form default'
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label className="publish-label" htmlFor="workbook_item_form_title">
                        {t('title')}
                    </label>
                    <input
                        id="workbook_item_form_title"
                        type="text"
                        name="title"
                        required
                        value={formState.title}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="publish-label" htmlFor="workbook_item_form_description">
                        {t('modules.workbook.note')}
                    </label>
                    <textarea
                        id="workbook_item_form_description"
                        name="description"
                        maxLength={300}
                        value={formState.description}
                        onChange={handleChange}
                    />
                </div>

                {type === 'InterviewReference' && interview && (
                    <CitationInfo
                        interview={interview}
                        project={project}
                        className="u-mb"
                    />
                )}

                {type === 'UserAnnotation' && interview && (
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
                        value={actualSubmitLabel}
                    />
                    {typeof onCancel === 'function' && (
                        <button
                            type="button"
                            className="Button Button--secondaryAction"
                            onClick={onCancel}
                        >
                            {t('cancel')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

WorkbookItemForm.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    properties: PropTypes.object,
    reference_id: PropTypes.number,
    reference_type: PropTypes.string,
    media_id: PropTypes.string,
    type: PropTypes.string,
    segmentIndex: PropTypes.number,
    workflow_state: PropTypes.string,
    shared: PropTypes.bool,
    submitLabel: PropTypes.string,
    interview: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    createWorkbook: PropTypes.func.isRequired,
    updateWorkbook: PropTypes.func.isRequired,
};
