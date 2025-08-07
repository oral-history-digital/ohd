import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { Modal } from 'modules/ui';

import usePDFMaterials from '../hooks/usePDFMaterials';
import PDFMaterial from './PDFMaterial';
import PDFForm from './PDFForm';

export default function PDFMaterialList() {
    const { isAuthorized } = useAuthorization();
    const { t } = useI18n();
    const interview = useSelector(getCurrentInterview);

    const { isLoading, isValidating, data: pdfMaterials } = usePDFMaterials(interview.archive_id);

    if (isLoading) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            <ul className="u-reset-list">
                {pdfMaterials.map((pdf) => <PDFMaterial key={pdf.id} pdf={pdf} />)}
            </ul>

            <AuthorizedContent object={{ type: 'PDF', interview_id: interview.id }} action='create'>
                <Modal
                    title={t('edit.pdf.new')}
                    trigger={<FaPlus className="Icon Icon--editorial" />}
                >
                    {
                        closeModal => (
                            <PDFForm
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
