import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { ScrollToTop } from 'modules/user-agent';
import HeadingContainer from './HeadingContainer';

export default function TableOfContents({
    headingsFetched,
    headings,
    preparedHeadings,
    archiveId,
    locale,
    projectId,
    projects,
    fetchData,
}) {
    const { t } = useI18n();

    useEffect(() => {
        if (!headingsFetched) {
            fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'headings');
        }
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
        <ScrollToTop>
            <div>
                {emptyHeadingsNote}
                <div className={'content-index'}>
                    {preparedHeadings.map((heading, index) => {
                        return <HeadingContainer
                            key={'mainheading-' + index}
                            data={heading}
                            nextHeading={preparedHeadings[index + 1]}
                        />
                    })}
                </div>
            </div>
        </ScrollToTop>
    );
}

TableOfContents.propTypes = {
    archiveId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    headingsFetched: PropTypes.bool.isRequired,
    headings: PropTypes.object,
    preparedHeadings: PropTypes.array,
    fetchData: PropTypes.func.isRequired,
};
