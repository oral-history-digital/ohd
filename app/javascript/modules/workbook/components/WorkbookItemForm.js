import { useState } from 'react';

import {
    BOOKMARK_INTERVIEW,
    BOOKMARK_SEGMENT,
    EDIT_WORKBOOK_ITEM,
    EVENT_CATEGORY_WORKBOOK,
    SAVE_SEARCH,
    useTrackEventFunction,
} from 'modules/analytics';
import { useWorkbookApi } from 'modules/api';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { formatTimecode } from 'modules/utils';
import PropTypes from 'prop-types';

import useMutateWorkbook from '../useMutateWorkbook';
import CitationInfo from './CitationInfo';
import SegmentLink from './SegmentLink';

/**
 * Creates or edits a workbook entry using the supplied project or current project details.
 * Waits for current project data only when no project was supplied.
 *
 * @param {Object} props - Entry data and form callbacks.
 * @param {Object} [props.project] - Entry's project; takes precedence over the current project.
 * @param {number} [props.id] - Existing entry ID; omit to create an entry.
 * @param {string} [props.title] - Saved title; otherwise derived from the entry type.
 * @param {Object} props.interview - Interview used for titles and citations.
 * @param {string} [props.description] - Saved note.
 * @param {Object} [props.properties] - Saved search or segment parameters.
 * @param {number} [props.reference_id] - Referenced record ID.
 * @param {string} [props.reference_type] - Referenced record type.
 * @param {string} [props.media_id] - Public interview identifier.
 * @param {string} [props.type] - Workbook entry type.
 * @param {number} [props.segmentIndex] - Referenced segment index.
 * @param {string} [props.workflow_state] - Entry's publication state.
 * @param {boolean} [props.shared] - Whether the entry is shared.
 * @param {string} [props.submitLabel] - Custom save button label.
 * @param {Function} props.onSubmit - Called after starting the save.
 * @param {Function} [props.onCancel] - Closes the form without saving.
 * @returns {React.ReactElement} Entry form, loading indicator, or project error.
 */
export default function WorkbookItemForm({
    project: suppliedProject,
    id,
    title,
    interview,
    description,
    properties,
    reference_id,
    reference_type,
    media_id,
    type,
    segmentIndex,
    workflow_state,
    shared,
    submitLabel,
    onSubmit,
    onCancel,
}) {
    const { project: currentProject, isLoading, error } = useProject();
    const project = suppliedProject ? suppliedProject : currentProject;
    const trackEvent = useTrackEventFunction();
    const { t, locale } = useI18n();
    const { createWorkbookItem, updateWorkbookItem } = useWorkbookApi();
    const mutateWorkbook = useMutateWorkbook();
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
        const name = interview?.anonymous_title?.[locale];
        const interviewStr = t('activerecord.models.interview.one');
        const archiveId = interview?.archive_id;
        const tapeStr = t('tape');

        switch (type) {
            case 'Search':
                return `${t('modules.workbook.full_text_search')} ${
                    properties.fulltext
                }`;
            case 'UserAnnotation':
                return `${name}, ${interviewStr} ${archiveId}, ${tapeStr} ${
                    properties.tape_nbr
                } – ${formatTimecode(properties.time)}`;
            case 'InterviewReference':
            default:
                return `${name}, ${interviewStr} ${archiveId}`;
        }
    }

    function getCreateEventAction() {
        switch (type) {
            case 'Search':
                return SAVE_SEARCH;
            case 'UserAnnotation':
                return BOOKMARK_SEGMENT;
            case 'InterviewReference':
            default:
                return BOOKMARK_INTERVIEW;
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
            mutateWorkbook(async (workbook) => {
                const itemData = { ...formState };
                if (suppliedProject) {
                    itemData.project_id = suppliedProject.id;
                }
                let serverResult, returnedId;
                if (id) {
                    serverResult = await updateWorkbookItem(id, itemData);
                    returnedId = id;
                    trackEvent(EVENT_CATEGORY_WORKBOOK, EDIT_WORKBOOK_ITEM);
                } else {
                    serverResult = await createWorkbookItem(itemData);
                    returnedId = serverResult.id;
                    trackEvent(EVENT_CATEGORY_WORKBOOK, getCreateEventAction());
                }

                const savedWorkbookItem = serverResult.data;

                const updatedWorkbook = {
                    ...workbook,
                    data: {
                        ...workbook.data,
                        [returnedId]: savedWorkbookItem,
                    },
                };

                return updatedWorkbook;
            });
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

    if (!suppliedProject) {
        if (error) {
            return (
                <InlineNotification
                    variant="error"
                    title={t('error')}
                    description={error.message}
                    isClosable={false}
                />
            );
        }
        if (isLoading || !project) return <Spinner />;
    }

    return (
        <div>
            <div className="errors">{formState.errors}</div>
            <form className="Form default" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label
                        className="publish-label"
                        htmlFor="workbook_item_form_title"
                    >
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
                    <label
                        className="publish-label"
                        htmlFor="workbook_item_form_description"
                    >
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
    project: PropTypes.object,
    id: PropTypes.number,
    title: PropTypes.string,
    interview: PropTypes.object.isRequired,
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
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
