import PropTypes from 'prop-types';
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
            PDF Materials

            <AuthorizedContent object={{ type: 'PDF', interview_id: interview.id }} action='create'>
                <Modal
                    title={t('edit.pdf.new')}
                    trigger={<FaPlus className="Icon Icon--editorial" />}
                >
                    {
                        closeModal => (
                            <PDFForm
                                interview={interview}
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
