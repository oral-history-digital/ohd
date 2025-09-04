import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { AuthorizedContent } from 'modules/auth';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { Modal } from 'modules/ui';

import useMaterials from '../hooks/useMaterials';
import Material from './Material';
import MaterialForm from './MaterialForm';

export default function MaterialList() {
    const { t } = useI18n();
    const interview = useSelector(getCurrentInterview);

    const {
        isLoading,
        isValidating,
        data: materials,
    } = useMaterials(interview.archive_id);

    if (isLoading) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }

    const authorizedObject = {
        type: 'Material',
        interview_id: interview.id,
    };

    return (
        <div>
            <ul className="u-reset-list">
                {materials.map((material) => (
                    <Material key={material.id} material={material} />
                ))}
            </ul>

            <AuthorizedContent object={authorizedObject} action="create">
                <Modal
                    title={t('edit.material.new')}
                    trigger={<FaPlus className="Icon Icon--editorial" />}
                >
                    {(closeModal) => (
                        <MaterialForm
                            withUpload
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
        </div>
    );
}
