import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import HeadingContainer from './HeadingContainer';

export default function TableOfContents({
    headingsFetched,
    headings,
    preparedHeadings,
    isIdle,
    archiveId,
    fetchData,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    useEffect(() => {
        // Only scroll to top if media has not started yet.
        // Otherwise, scrolling is handled in Heading/Subheading components.
        if (isIdle) {
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if (headingsFetched) {
            return;
        }

        fetchData({ locale, projectId, project }, 'interviews', archiveId, 'headings');
    }, [headingsFetched])

    if (!headingsFetched) {
        return <Spinner />;
    }

    let emptyHeadingsNote;
    if (Object.values(headings).length <= 0) {
        emptyHeadingsNote = t('without_index');
    } else if (preparedHeadings.length <= 0) {
        emptyHeadingsNote = t('without_index_locale');
    }

    return (
        <div>
            {emptyHeadingsNote}
            <div className="content-index">
                {preparedHeadings.map((heading, index) => (
                    <HeadingContainer
                        key={heading.chapter}
                        data={heading}
                        nextHeading={preparedHeadings[index + 1]}
                    />
                ))}
            </div>
        </div>
    );
}

TableOfContents.propTypes = {
    archiveId: PropTypes.string.isRequired,
    headingsFetched: PropTypes.bool.isRequired,
    headings: PropTypes.object,
    preparedHeadings: PropTypes.array,
    isIdle: PropTypes.bool.isRequired,
    fetchData: PropTypes.func.isRequired,
};
