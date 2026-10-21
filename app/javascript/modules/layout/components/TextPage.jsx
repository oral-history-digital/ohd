import { useState } from 'react';

import { AuthorizedContent } from 'modules/auth';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { ScrollToTop } from 'modules/user-agent';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

/**
 * Shows localized project page content and requests stored translations only when editing.
 * @param {Object} props - Page identity.
 * @param {string} props.code - Static page code, such as conditions or contact.
 * @returns {React.ReactElement} Page content, translation editor, or project loading/error state.
 */
export function TextPage({ code }) {
    const [editing, setEditing] = useState(false);
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({
        profile: editing ? 'edit' : 'display',
        include: ['texts'],
    });
    const pathBase = usePathBase();
    const dispatch = useDispatch();

    /** Switches between localized display content and editable stored translations. */
    function toggleEditing() {
        setEditing((prev) => !prev);
    }

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner />;

    const text = project?.texts?.find((t) => t.code === code) || {};

    return editing ? (
        <Form
            data={text}
            values={{
                project_id: project.id,
                code: code,
            }}
            helpTextCode={'static-texts.' + code}
            scope={'text'}
            onSubmit={(params) => {
                dispatch(submitData({ pathBase }, params));
                toggleEditing();
            }}
            onCancel={toggleEditing}
            submitText="submit"
            elements={[
                {
                    attribute: 'text',
                    elementType: 'richTextEditor',
                    multiLocale: true,
                },
            ]}
        />
    ) : (
        <ScrollToTop>
            <div className="wrapper-content register">
                <div
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(text?.text, 'RICH_TEXT'),
                    }}
                />

                <AuthorizedContent
                    object={{ type: 'Project', id: project.id }}
                    action="update"
                >
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        onClick={toggleEditing}
                    >
                        <FaPencilAlt className="Icon Icon--editorial" />{' '}
                        {t('edit.default.edit')}
                    </button>
                </AuthorizedContent>
            </div>
        </ScrollToTop>
    );
}

TextPage.propTypes = {
    code: PropTypes.string.isRequired,
};

export default TextPage;
