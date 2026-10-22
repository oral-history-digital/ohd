import { useState } from 'react';

import { submitFormDataWithFetch } from 'modules/api';
import { getArchiveId } from 'modules/archive';
import { getCurrentInterview } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import useMutateMaterials from '../hooks/useMutateMaterials';

/**
 * Creates or edits interview materials and updates their existing SWR cache.
 * Uploads use the current project and locale route without loading project details.
 *
 * @param {Object} props - Material form settings.
 * @param {Object} [props.material] - Existing material; omit to create one.
 * @param {boolean} [props.withUpload=false] - Adds a required PDF upload field.
 * @param {Function} [props.onSubmit] - Called after starting the save.
 * @param {Function} [props.onCancel] - Closes the form without saving.
 * @returns {React.ReactElement} Material editing form.
 */
export default function MaterialForm({
    material,
    withUpload = false,
    onSubmit,
    onCancel,
}) {
    const pathBase = usePathBase();
    const archiveId = useSelector(getArchiveId);
    const interview = useSelector(getCurrentInterview);
    const mutateMaterials = useMutateMaterials(archiveId);
    const [isFetching, setIsFetching] = useState(false);

    function elements() {
        let elements = [
            {
                attribute: 'title',
                multiLocale: true,
            },
            {
                attribute: 'description',
                multiLocale: true,
            },
            {
                elementType: 'select',
                attribute: 'workflow_state',
                values: ['unshared', 'public'],
                value: material?.workflow_state || 'unshared',
                optionsScope: 'workflow_states',
            },
        ];

        if (withUpload) {
            elements.push({
                attribute: 'data',
                elementType: 'input',
                type: 'file',
                accept: 'application/pdf',
                validate: function (v) {
                    return v instanceof File;
                },
            });
        }

        return elements;
    }

    async function createOrUpdateMaterial(params) {
        mutateMaterials(async (materials) => {
            setIsFetching(true);
            const result = await submitFormDataWithFetch(pathBase, params);
            const updatedMaterial = result.data;

            // Other stuff that needs to be done after result is returned.
            setIsFetching(false);

            const updatedMaterials = {
                ...materials,
                data: {
                    ...materials.data,
                    [updatedMaterial.id]: updatedMaterial,
                },
            };
            return updatedMaterials;
        });

        if (typeof onSubmit === 'function') {
            onSubmit();
        }
    }

    return (
        <Form
            scope="material"
            helpTextCode="material_form"
            onSubmit={createOrUpdateMaterial}
            onCancel={onCancel}
            data={material}
            values={{
                interview_id: interview?.id,
                id: material?.id,
            }}
            elements={elements()}
            fetching={isFetching}
        />
    );
}

MaterialForm.propTypes = {
    material: PropTypes.object,
    withUpload: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
