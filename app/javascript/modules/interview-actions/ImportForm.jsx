import { useCallback, useState } from 'react';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Button, InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import ImportValidationFeedback from './ImportValidationFeedback';
import SpeakerDesignationInputs from './SpeakerDesignationInputs';
import { useImportSpeakers, useImportValidation } from './hooks';

/**
 * Validates an import before queueing it and displays errors or queued feedback.
 * @param {Object} props - Import resource, fields, payload preparation, and callbacks.
 * @returns {React.ReactElement} Import controls or completion feedback.
 */
export default function ImportForm({
    resource,
    scope,
    submitData,
    prepareParams,
    onCancel,
    template,
    children,
    values,
    elements,
    submitText,
    labelPosition,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();
    const [queued, setQueued] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [file, setFile] = useState(null);
    const speakers = useImportSpeakers(
        pathBase,
        resource,
        scope,
        values.archive_id,
        file
    );
    const prepare = useCallback(
        (formValues) =>
            prepareParams ? prepareParams(formValues) : { [scope]: formValues },
        [prepareParams, scope]
    );
    const validation = useImportValidation(pathBase, resource, prepare);

    /**
     * Queues a current, valid upload and waits for the Redux mutation callback.
     * @param {Object} params - Scoped form values, including the uploaded file.
     * @returns {Promise<void>} Resolves when the import is queued.
     */
    async function handleSubmit(params) {
        if (submitting || validation.status === 'checking') return;
        setSubmitError(false);
        if (!(await validation.check(params[scope]))) {
            throw new Error('Import pre-check did not pass');
        }
        setSubmitting(true);
        return new Promise((resolve, reject) => {
            submitData(
                { pathBase },
                prepare(params[scope]),
                {
                    onError: () => {
                        setSubmitting(false);
                        setSubmitError(true);
                        reject(new Error('Import request failed'));
                    },
                },
                () => {
                    setSubmitting(false);
                    setQueued(true);
                    resolve();
                }
            );
        });
    }

    if (queued) {
        return (
            <>
                <InlineNotification
                    variant="success"
                    title={t('import_validation.queued')}
                    description={t('import_validation.queued_hint')}
                    role="status"
                    isClosable={false}
                />
                <div className="u-align-right">
                    <Button buttonText={t('close')} onClick={onCancel} />
                </div>
            </>
        );
    }

    return (
        <>
            {template}
            {children}
            <Form
                scope={scope}
                onChange={({ field, value }) => {
                    validation.reset();
                    setSubmitError(false);
                    if (field === 'data') setFile(value);
                }}
                fetching={
                    submitting ||
                    validation.status === 'checking' ||
                    speakers.isLoading
                }
                onCancel={onCancel}
                onSubmit={handleSubmit}
                submitText={submitText}
                values={values}
                elements={elements.map((element) =>
                    element.elementType === 'speakerDesignationInputs'
                        ? {
                              ...element,
                              component: SpeakerDesignationInputs,
                              speakerOptions: speakers.options,
                              speakerOptionsLoading: speakers.isLoading,
                              labelPosition: 'beside',
                          }
                        : element
                )}
                labelPosition={labelPosition}
            >
                <ImportValidationFeedback {...validation} />
                {speakers.error && (
                    <InlineNotification
                        variant="warning"
                        title={t('import_validation.speakers_unavailable')}
                        isClosable={false}
                    />
                )}
                {submitError && (
                    <InlineNotification
                        variant="error"
                        title={t('import_validation.import_failed')}
                        isClosable={false}
                    />
                )}
            </Form>
        </>
    );
}

ImportForm.propTypes = {
    resource: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
    prepareParams: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    template: PropTypes.node,
    children: PropTypes.node,
    values: PropTypes.object,
    elements: PropTypes.array.isRequired,
    submitText: PropTypes.string.isRequired,
    labelPosition: PropTypes.oneOf(['above', 'beside']),
};
