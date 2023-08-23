import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getStatuses } from 'modules/data';
import { TapeAndTime } from 'modules/interview-helpers';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';

export default function RefObjectLink({
    registryReference,
    segments,
    isLoggedIn,
    onSubmit,
    sendTimeChangeRequest,
    setArchiveId,
    fetchData,
}) {
    const pathBase = usePathBase();
    const { locale } = useI18n();
    const { project, projectId } = useProject();

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
                isLoggedIn && segment && segment.transcript_coupled && sendTimeChangeRequest(segment.tape_nbr, segment.time);
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            to={pathBase + '/interviews/' + registryReference.archive_id}
        >
            <TapeAndTime tape={segment.tape_nbr} time={segment.time} transcriptCoupled={segment.transcript_coupled} />
        </Link>
    )
}
