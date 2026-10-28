import { useEffect } from 'react';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import HeadingContainer from './HeadingContainer';
import { getPreparedHeadings } from './getPreparedHeadings';

/**
 * Loads interview headings and displays them in the selected content language.
 *
 * @param {Object} props - Heading context.
 * @param {boolean} props.headingsFetched - Whether heading data has loaded.
 * @param {Object} [props.headings] - Heading segments by ID.
 * @param {string} [props.alpha3] - Selected content language code.
 * @param {boolean} props.isIdle - Whether playback has not started on mount.
 * @param {string} props.archiveId - Public interview identifier.
 * @param {Function} props.fetchData - Loads interview headings through Redux.
 * @returns {React.ReactElement} Headings, an empty-state message, or loading indicator.
 */
export default function TableOfContents({
    headingsFetched,
    headings,
    alpha3,
    isIdle,
    archiveId,
    fetchData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

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

        fetchData({ pathBase }, 'interviews', archiveId, 'headings');
    }, [headingsFetched, fetchData, pathBase, archiveId]);

    if (!headingsFetched) {
        return <Spinner />;
    }

    const preparedHeadings = getPreparedHeadings(headings, alpha3);

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
    alpha3: PropTypes.string,
    preparedHeadings: PropTypes.array,
    isIdle: PropTypes.bool.isRequired,
    fetchData: PropTypes.func.isRequired,
};
