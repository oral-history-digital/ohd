import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { getStatuses } from 'modules/data';
import { formatTimecode } from 'modules/interview-helpers';

export default function RefObjectLink({
    registryReference,
    interviews,
    segments,
    isLoggedIn,
    locale,
    projectId,
    projects,
    onSubmit,
    sendTimeChangeRequest,
    setArchiveId,
    fetchData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const statuses = useSelector(getStatuses);
    const interview = interviews[registryReference.archive_id];
    const segment = registryReference.ref_object_type === 'Segment' && segments[registryReference.ref_object_id];
    const interviewTitle = isLoggedIn ? interview?.short_title?.[locale] : interview?.anonymous_title[locale];
    let title = interviewTitle + ` (${registryReference.archive_id})`;

    if (isLoggedIn && segment) {
        const tape = segment?.tape_number > 1 ? `(${t('tape')} ${segment.tape_nbr}/${segment.tape_count})` : '';
        title = segment && `${formatTimecode(segment.time)} ${tape} ${t('in')} ${title}`;
    }

    const fetchingInterview = !!statuses['interviews'][registryReference.archive_id];
    const fetchingShortTitle = !!statuses['short_title']?.[`for_interviews_${registryReference.archive_id}`];
    const fetchingSegment = !!statuses['segments'][registryReference.ref_object_id];

    useEffect(() => {
        if (!fetchingInterview) {
            fetchData({ projectId, locale, projects }, 'interviews', registryReference.archive_id);
        }
    }, [interview, isLoggedIn]);

    useEffect(() => {
        if (!fetchingShortTitle && isLoggedIn) {
            fetchData({ projectId, locale, projects }, 'interviews', registryReference.archive_id, 'short_title');
        }
    }, [interview, isLoggedIn]);

    useEffect(() => {
        if (
            !fetchingSegment &&
            registryReference.ref_object_type === 'Segment' &&
            isLoggedIn
        ) {
            fetchData({ projectId, locale, projects }, 'segments', registryReference.ref_object_id);
        }
    }, [segment, isLoggedIn]);

    return (
        <Link className={'search-result-link'}
            key={registryReference.id}
            onClick={() => {
                setArchiveId(registryReference.archive_id);
                isLoggedIn && segment && sendTimeChangeRequest(segment.tape_nbr, segment.time);
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            to={pathBase + '/interviews/' + registryReference.archive_id}
        >
            {title}
        </Link>
    )
}
