import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';

export default function RequestProjectAccessForm({
    externalLinks,
    locale,
    projectId,
    projects,
    project,
    submitData,
    closeArchivePopup,
    onSubmit,
}) {

    const { t } = useI18n();

    let conditionsLink = Object.values(externalLinks).filter(link => link.internal_name === 'conditions')[0];
    let privacyLink = Object.values(externalLinks).filter(link => link.internal_name === 'privacy_protection')[0];
    conditionsLink =  (conditionsLink && conditionsLink.url) || {}
    privacyLink =  (privacyLink && privacyLink.url) || {}

    return (
        <Form
            scope='user_registration_project'
            onSubmit={(params) => {
                submitData({ locale, projectId, projects }, params);
                closeArchivePopup();
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            values={{ 
                project_id: project.id,
            }}
            submitText='submit'
            elements={[
                {
                    elementType: 'input',
                    attribute: 'tos_agreement',
                    labelKey: 'user_registration.tos_agreement',
                    type: 'checkbox',
                    validate: function(v){return v && v !== '0'},
                    help: (
                        <a href={conditionsLink[locale]} target="_blank" title="Externer Link" rel="noopener">
                            {t('user_registration.notes_on_tos_agreement')}
                        </a>
                    )
                },
                {
                    elementType: 'input',
                    attribute: 'priv_agreement' ,
                    labelKey: 'user_registration.priv_agreement',
                    type: 'checkbox',
                    validate: function(v){return v && v !== '0'},
                    help: (
                        <a href={privacyLink[locale]} target="_blank" title="Externer Link" rel="noopener">
                            {t('user_registration.notes_on_priv_agreement')}
                        </a>
                    )
                },
            ]}
        />
    );
}

RequestProjectAccessForm.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
};
