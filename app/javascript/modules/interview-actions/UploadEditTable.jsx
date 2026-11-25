import { useState } from 'react';

import { getArchiveId } from 'modules/archive';
import { getCurrentInterview, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Modal, SubmitButton } from 'modules/ui';
import { FaDownload } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import EditTableImportForm from './EditTableImportForm';

/**
 * Opens edit-table importing in a modal and keeps the template in the sidebar.
 * @returns {React.ReactElement|null} Editing controls and request feedback.
 */
export default function UploadEditTable() {
    const archiveId = useSelector(getArchiveId);
    const interview = useSelector(getCurrentInterview);
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const [showDialog, setShowDialog] = useState(false);

    if (!interview.contributions) return null;

    const template = (
        <p>
            <a
                href={`${pathBase}/edit-table-import-template.csv?id=${archiveId}&locale=${locale}`}
                download
            >
                <span className="flyout-sub-tabs-content-ico-link">
                    <FaDownload
                        className="Icon Icon--small"
                        aria-hidden="true"
                    />{' '}
                    {t('edit.upload_edit_table.template')}
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
                    buttonText={t('edit.upload_edit_table.title')}
                    onClick={() => setShowDialog(true)}
                />
            </div>
            {showDialog && (
                <Modal
                    key={archiveId}
                    title={t('edit.upload_edit_table.title')}
                    trigger={t('edit.upload_edit_table.title')}
                    hideButton
                    showDialogInitially
                    onClose={() => setShowDialog(false)}
                >
                    {(close) => (
                        <EditTableImportForm
                            archiveId={archiveId}
                            interview={interview}
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
