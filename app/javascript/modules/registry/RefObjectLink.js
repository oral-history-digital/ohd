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
    const segment = registryReference.ref_object_type === 'Segment' && segments[registryReference.ref_object_id];

    const tape = `${t('tape')} ${segment?.tape_nbr}`;
    const title = segment && `${tape} - ${formatTimecode(segment.time)}`;

    const fetchingSegment = !!statuses['segments'][registryReference.ref_object_id];

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
        <Link className={'small'}
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
