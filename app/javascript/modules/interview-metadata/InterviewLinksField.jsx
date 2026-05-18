import { useIsEditor } from 'modules/archive';
import { SingleValueWithForm } from 'modules/forms';
import PropTypes from 'prop-types';

import { normalizeLinks } from './utils';

export default function InterviewLinksField({ interview }) {
    const isEditor = useIsEditor();

    const normalizedLinks = normalizeLinks(interview?.links);
    const hasLinks = normalizedLinks.length > 0;
    const editableLinksValue = normalizedLinks.join('\n');

    // Keep displayed links as an array, but seed the edit form with newline-separated
    // text so existing comma-separated values open one-link-per-line in the textarea.
    const formInterview = {
        ...(interview || {}),
        pseudo_links: editableLinksValue,
    };

    if (!(isEditor || hasLinks)) {
        return null;
    }

    return (
        <SingleValueWithForm
            obj={formInterview}
            value={normalizedLinks}
            editValue={editableLinksValue}
            attribute="pseudo_links"
            elementType="textarea"
            help="modules.interview_metadata.link_field_help"
            hideEmpty
            linkUrls
        />
    );
}

InterviewLinksField.propTypes = {
    interview: PropTypes.object.isRequired,
};
