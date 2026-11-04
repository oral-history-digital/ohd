import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import { useAdminDataActions } from '../hooks';
import DataList from './DataList';

/**
 * Edits current-project logos or the institution logos supplied by a nested admin list.
 * Institution editors use display settings only for locale choices.
 * @param {Object} props - Optional institution logo records and ownership values.
 * @returns {React.ReactElement} Logo list, loading indicator, or request error.
 */
export default function Logos({ data, initialFormValues } = {}) {
    const isInstitution = initialFormValues?.ref_type === 'Institution';
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject(
        isInstitution ? {} : { profile: 'edit', include: ['branding'] }
    );
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (projectLoading || !project) return <Spinner />;

    return (
        <DataList
            editView
            data={isInstitution ? data : project.logos}
            outerScope={isInstitution ? 'institution' : 'project'}
            outerScopeId={isInstitution ? initialFormValues.ref_id : project.id}
            scope="logo"
            detailsAttributes={['src', 'locale']}
            initialFormValues={
                isInstitution
                    ? initialFormValues
                    : {
                          ref_id: project.id,
                          ref_type: 'Project',
                          type: 'Logo',
                      }
            }
            formElements={[
                {
                    attribute: 'locale',
                    elementType: 'select',
                    values: project.available_locales,
                    withEmpty: true,
                },
                {
                    attribute: 'file',
                    elementType: 'fileInput',
                    preview: 'image',
                },
            ]}
            helpTextCode="logo_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}

Logos.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    initialFormValues: PropTypes.shape({
        ref_id: PropTypes.number.isRequired,
        ref_type: PropTypes.string.isRequired,
        type: PropTypes.string,
    }),
};
