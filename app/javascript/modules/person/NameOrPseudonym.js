import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import { ContentField } from 'modules/forms';
import { AuthorizedContent, AuthShowContainer } from 'modules/auth';
import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import PersonForm from './PersonForm';

export default function NameOrPseudonym({
    type,
    person,
    interview,
    fetching = false,
}) {
    const { t, locale } = useI18n();

    let label, value;

    if (type === 'pseudonym') {
        label = person.use_pseudonym
            ? t('interviewee_name')
            : t('activerecord.attributes.person.pseudonym');

        if (person.use_pseudonym && person.names[locale]) {
            value = `${person.names[locale].first_name} ${person.names[locale].last_name}`;
        } else if (!person.use_pseudonym && person.pseudonym) {
            value = person.pseudonym;
        }

        if (!value) {
            return null;
        }

        return (
            <AuthShowContainer ifLoggedIn>
                <ContentField
                    label={label}
                    value={value}
                    fetching={fetching}
                />
            </AuthShowContainer>
        );
    }

    label = person.use_pseudonym
        ? t('activerecord.attributes.person.pseudonym')
        : t('interviewee_name');
    value = person.display_name;

    return (<>
        <AuthShowContainer ifLoggedIn>
            <ContentField
                label={label}
                value={value}
                fetching={fetching}
            >
                <AuthorizedContent object={person} action='update'>
                    <Modal
                        hideHeading
                        title={t('edit.contribution.edit')}
                        trigger={(<>
                            <FaPencilAlt className="Icon Icon--editorial Icon--small" />
                            {' '}
                            {t('edit.contribution.edit')}
                        </>)}
                    >
                        {close => (
                            <PersonForm
                                data={person}
                                onSubmit={close}
                                onCancel={close}
                            />
                        )}
                    </Modal>
                </AuthorizedContent>
            </ContentField>
        </AuthShowContainer>

        <AuthShowContainer ifLoggedOut ifNoProject>
            <ContentField
                label={label}
                value={interview?.anonymous_title?.[locale]}
                fetching={fetching}
            />
        </AuthShowContainer>
    </>);
}

NameOrPseudonym.propTypes = {
    type: PropTypes.oneOf(['name', 'pseudonym']).isRequired,
    person: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    fetching: PropTypes.bool,
};
