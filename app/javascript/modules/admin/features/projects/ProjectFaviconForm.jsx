import { useState } from 'react';

import { receiveData } from 'modules/data';
import { FileInputField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Button, CancelButton, InlineNotification, Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { getCsrfToken } from '../../../../utils/csrfToken';

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
    '.ico',
    'image/png',
    'image/x-icon',
    'image/vnd.microsoft.icon',
];

export default function ProjectFaviconForm({ project }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const hasSelectedFiles = Array.isArray(file)
        ? file.length > 0
        : Boolean(file);

    function translationKeyForError(error) {
        const normalizedError =
            error === 'invalid_content_type' ? 'invalid_type' : error;
        return `edit.project.favicon.${normalizedError}`;
    }

    async function request(method, body) {
        setIsLoading(true);
        setNotification(null);

        try {
            const response = await fetch(
                `${pathBase}/projects/${project.id}/favicon.json`,
                {
                    method,
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-Token': getCsrfToken(),
                    },
                    body,
                }
            );
            const payload = await response.json();

            if (!response.ok) {
                const error = payload.errors?.[0];
                setNotification({
                    variant: 'error',
                    title: t('edit.project.favicon.error_title'),
                    description: t(
                        error
                            ? translationKeyForError(error)
                            : 'edit.project.favicon.failed'
                    ),
                });
                return false;
            }

            dispatch(receiveData(payload));
            return true;
        } catch (_error) {
            setNotification({
                variant: 'error',
                title: t('edit.project.favicon.error_title'),
                description: t('edit.project.favicon.failed'),
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!hasSelectedFiles) return;

        const body = new FormData();
        body.append('project[favicon]', file);

        if (await request('PUT', body)) {
            setFile(null);
            setNotification({
                variant: 'success',
                title: t('edit.project.favicon.success_title'),
                description: t('edit.project.favicon.saved'),
            });
        }
    }

    async function handleRemove() {
        if (await request('DELETE')) {
            setNotification({
                variant: 'success',
                title: t('edit.project.favicon.success_title'),
                description: t('edit.project.favicon.removed'),
            });
            return true;
        }

        return false;
    }

    return (
        <section className="ProjectFaviconForm">
            <h2>{t('activerecord.attributes.project.favicon')}</h2>
            <p className="ProjectFaviconForm-description">
                {t('edit.project.favicon.description')}
            </p>
            <div className="ProjectFaviconForm-content">
                <form onSubmit={handleSubmit}>
                    <FileInputField
                        id="project-favicon"
                        name="favicon"
                        label={t('activerecord.attributes.project.favicon')}
                        value={file}
                        currentFiles={
                            project.favicon_url
                                ? {
                                      name: 'favicon',
                                      url: project.favicon_url,
                                      contentType: 'image/x-icon',
                                  }
                                : []
                        }
                        accept={ACCEPTED_FILE_TYPES}
                        maxSize={MAX_FILE_SIZE}
                        preview="image"
                        help={t('edit.project.favicon.help')}
                        removeCurrentLabel={t('edit.project.favicon.remove')}
                        onChange={(selectedFile) => {
                            setFile(selectedFile);
                            setNotification(null);
                        }}
                        onRemoveCurrent={() => setShowRemoveDialog(true)}
                        disabled={isLoading}
                    />
                    {hasSelectedFiles && (
                        <Button
                            className="ProjectFaviconForm-submit"
                            type="submit"
                            variant="contained"
                            buttonText={t('submit')}
                            isLoading={isLoading}
                        />
                    )}
                </form>
            </div>

            {notification && (
                <InlineNotification
                    key={`${notification.variant}-${notification.description}`}
                    variant={notification.variant}
                    title={notification.title}
                    description={notification.description}
                    onClose={() => setNotification(null)}
                    autoHideDuration={
                        notification.variant === 'success' ? 3000 : null
                    }
                />
            )}

            <Modal
                className="ProjectFaviconForm-confirmDialog"
                title={t('edit.project.favicon.remove_confirm')}
                trigger={<span />}
                hideButton
                showDialogInitially={showRemoveDialog}
                onClose={() => setShowRemoveDialog(false)}
            >
                {(closeDialog) => (
                    <form
                        className="Form"
                        onSubmit={async (event) => {
                            event.preventDefault();
                            if (await handleRemove()) {
                                setShowRemoveDialog(false);
                                closeDialog();
                            }
                        }}
                    >
                        <p>{t('edit.project.favicon.remove_warning')}</p>
                        <div className="Form-footer u-mt">
                            <CancelButton
                                handleCancel={() => {
                                    setShowRemoveDialog(false);
                                    closeDialog();
                                }}
                                isDisabled={isLoading}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                buttonText={t('edit.project.favicon.remove')}
                                isLoading={isLoading}
                            />
                        </div>
                    </form>
                )}
            </Modal>
        </section>
    );
}

ProjectFaviconForm.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
        favicon_url: PropTypes.string,
    }).isRequired,
};
