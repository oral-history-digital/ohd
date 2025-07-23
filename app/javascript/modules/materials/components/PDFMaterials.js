import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import PDFForm from './PDFForm';


export default function PDFMaterials() {
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();
    const interview = useSelector(getCurrentInterview);

    return (
        <div>
            <div>
                PDF Materials
            </div>

            <AuthorizedContent object={{ type: 'PDF', interview_id: interview.id }} action='create'>
                <Modal
                    title={t('edit.pdf.new')}
                    trigger={<FaPlus className="Icon Icon--editorial" />}
                >
                    {
                        closeModal => (
                            <PDFForm
                                interview={interview}
                                withUpload
                                onSubmit={closeModal}
                                onCancel={closeModal}
                            />
                        )
                    }
                </Modal>
            </AuthorizedContent>
        </div>
    );
}
