import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { usePathBase } from 'modules/routes';
import { getStatuses } from 'modules/data';
import { Spinner } from 'modules/spinners';
import { TapeAndTime } from 'modules/interview-helpers';

export default function RefObjectLink({
    registryReference,
    interviews,
    segments,
    isLoggedIn,
    locale,
    projectId,
    project,
    onSubmit,
    sendTimeChangeRequest,
    setArchiveId,
    fetchData,
}) {
    const pathBase = usePathBase();
    const statuses = useSelector(getStatuses);
    const segment = registryReference.ref_object_type === 'Segment' && segments[registryReference.ref_object_id];

    const fetchingSegment = !!statuses['segments'][registryReference.ref_object_id];

    useEffect(() => {
        if (
            !fetchingSegment &&
            registryReference.ref_object_type === 'Segment' &&
            isLoggedIn
        ) {
            fetchData({ projectId, locale, project }, 'segments', registryReference.ref_object_id);
        }
    }, [segment, isLoggedIn]);

    if (!segment) {
        return <Spinner small className="u-inline-block" />;
    }

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
            <TapeAndTime tape={segment.tape_nbr} time={segment.time} />
        </Link>
    )
}
