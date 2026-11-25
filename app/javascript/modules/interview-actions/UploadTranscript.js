import { useState } from 'react';

import { useI18n } from 'modules/i18n';
import { Modal, SubmitButton } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

import TranscriptImportForm from './TranscriptImportForm';

/**
 * Opens transcript importing in a modal while keeping the template in the sidebar.
 * @param {Object} props - Interview, language options, archive ID, and Redux mutation callback.
 * @returns {React.ReactElement|null} Template link and modal trigger.
 */
export default function UploadTranscript(props) {
    const { t } = useI18n();
    const [showDialog, setShowDialog] = useState(false);
    if (!props.interview.contributions) return null;
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
                    key={props.archiveId}
                    title={t('edit.upload_transcript.title')}
                    trigger={t('edit.upload_transcript.title')}
                    hideButton
                    showDialogInitially
                    onClose={() => setShowDialog(false)}
                >
                    {(close) => (
                        <TranscriptImportForm
                            {...props}
                            template={template}
                            onCancel={close}
                        />
                    )}
                </Modal>
            )}
        </>
    );
}

UploadTranscript.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
};
