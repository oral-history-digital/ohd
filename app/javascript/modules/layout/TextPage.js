import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import { ScrollToTop } from 'modules/user-agent';
import { AuthorizedContent } from 'modules/auth';
import { Form } from 'modules/forms';
import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { submitData } from 'modules/data';

export default function TextPage({ code }) {
    const [editing, setEditing] = useState(false);
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const dispatch = useDispatch();

    function toggleEditing() {
        setEditing((prev) => !prev);
    }

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
                dispatch(submitData({ project, projectId, locale }, params));
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
                    dangerouslySetInnerHTML={{ __html: text?.text?.[locale] }}
                />

                <AuthorizedContent object={project} action="update">
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
