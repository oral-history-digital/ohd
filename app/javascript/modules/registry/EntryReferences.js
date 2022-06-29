import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import groupBy from 'lodash.groupby';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { getStatuses } from 'modules/data';
import RefObjectLinkContainer from './RefObjectLinkContainer';

export default function EntryReferences({
    registryEntry,
    interviews,
    segments,
    isLoggedIn,
    locale,
    projectId,
    projects,
    onSubmit,
    setArchiveId,
    fetchData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const statuses = useSelector(getStatuses);

    const groupedReferences = groupBy(registryEntry.registry_references, 'archive_id');
    const referencesCount = Object.values(groupedReferences);
    const archiveIds = Object.keys(groupedReferences);

    useEffect(() => {
        archiveIds.map(archiveId => {
            if (!statuses['interviews'][archiveId]) {
                fetchData({ projectId, locale, projects }, 'interviews', archiveId);
            }
        })
    }, [isLoggedIn]);

    useEffect(() => {
        archiveIds.map(archiveId => {
            if (!statuses['short_title']?.[`for_interviews_${archiveId}`]) {
                fetchData({ projectId, locale, projects }, 'interviews', archiveId, 'short_title');
            }
        })
    }, [isLoggedIn]);

    return (
        <>
            <h4>
                {referencesCount.length}
                &nbsp;
                {(referencesCount.length === 1) ? t('activerecord.models.registry_reference.one') : t('activerecord.models.registry_reference.other')}
                {referencesCount.length > 0 ? ':' : ''}
            </h4>
            <br/>
            <ul>
                {
                    archiveIds.map(archiveId => {
                        const interview = interviews[archiveId];
                        const interviewTitle = isLoggedIn ? interview?.short_title?.[locale] : interview?.anonymous_title[locale];
                        return (
                            <li
                                key={`references-${registryEntry.id}-${archiveId}`}
                            >
                                <Link className={'search-result-link'}
                                    key={archiveId}
                                    onClick={() => {
                                        setArchiveId(archiveId);
                                    }}
                                    to={pathBase + '/interviews/' + archiveId}
                                >
                                    {`${t('activerecord.models.registry_reference.one')} ${t('in')} ${interviewTitle} (${archiveId})`}
                                </Link>
                                <>
                                    {
                                        groupedReferences[archiveId].filter(ref => ref.ref_object_type === 'Segment').map(ref => {
                                            return <RefObjectLinkContainer registryReference={ref} onSubmit={onSubmit} />
                                        })
                                    }
                                </>
                            </li>
                        )
                    })
                }
            </ul>
            {
                //!references || (references.length !== Object.keys(this.registryEntry().registry_references).length) && <PixelLoader/>
            }
        </>
    )
}
