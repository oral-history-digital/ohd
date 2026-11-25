import { useState } from 'react';

import { getArchiveId } from 'modules/archive';
import { getCurrentInterview, getLanguages, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal, SubmitButton } from 'modules/ui';
import { FaDownload } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import TranscriptImportForm from './TranscriptImportForm';

/**
 * Opens transcript importing in a modal while keeping the template in the sidebar.
 * @returns {React.ReactElement|null} Template link and modal trigger.
 */
export default function UploadTranscript() {
    const archiveId = useSelector(getArchiveId);
    const interview = useSelector(getCurrentInterview);
    const languages = useSelector(getLanguages);
    const dispatch = useDispatch();
    const { t } = useI18n();
    const [showDialog, setShowDialog] = useState(false);
    if (!interview.contributions) return null;
    const template = (
        <p>
            <a href="/transcript-import-template.csv" download>
                <span className="flyout-sub-tabs-content-ico-link">
                    <FaDownload
                        className="Icon Icon--small"
                        aria-hidden="true"
                    />{' '}
                    {t('transcript_template')}
                </span>
            </a>
        </p>
    );
    return (
        <>
            <div className="u-align-right">
                {template}
                <SubmitButton
                    type="button"
                    buttonText={t('edit.upload_transcript.title')}
                    onClick={() => setShowDialog(true)}
                />
            </div>
            {showDialog && (
                <Modal
                    key={archiveId}
                    title={t('edit.upload_transcript.title')}
                    trigger={t('edit.upload_transcript.title')}
                    hideButton
                    showDialogInitially
                    onClose={() => setShowDialog(false)}
                >
                    {(close) => (
                        <TranscriptImportForm
                            archiveId={archiveId}
                            interview={interview}
                            languages={languages}
                            submitData={(...args) =>
                                dispatch(submitData(...args))
                            }
                            template={template}
                            onCancel={close}
                        />
                    )}
                </Modal>
            )}
        </>
    );
}
