import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import findExternalLink from '../findExternalLink';

export default function RequestProjectAccessForm({
    externalLinks,
    locale,
    projectId,
    project,
    submitData,
    onSubmit,
    onCancel,
}) {

    const { t } = useI18n();

    const conditionsLink = findExternalLink(project, 'conditions');
    const privacyLink = findExternalLink(project, 'privacy_protection');

    return (
        <Form
            scope='user_project'
            onSubmit={(params) => {
                submitData({ locale, projectId, project }, params);
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            onCancel={onCancel}
            values={{
                project_id: project.id,
            }}
            submitText='submit'
            elements={[
                {
                    elementType: 'input',
                    attribute: 'tos_agreement',
                    labelKey: 'user.tos_agreement',
                    type: 'checkbox',
                    validate: function(v){return v && v !== '0'},
                    help: (
                        <a href={conditionsLink[locale]} target="_blank" title="Externer Link" rel="noreferrer">
                            {t('user.notes_on_tos_agreement')}
                        </a>
                    )
                },
                {
                    elementType: 'input',
                    attribute: 'priv_agreement' ,
                    labelKey: 'user.priv_agreement',
                    type: 'checkbox',
                    validate: function(v){return v && v !== '0'},
                    help: (
                        <a href={privacyLink[locale]} target="_blank" title="Externer Link" rel="noreferrer">
                            {t('user.notes_on_priv_agreement')}
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
    project: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
