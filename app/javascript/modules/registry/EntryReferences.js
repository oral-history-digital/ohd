import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import groupBy from 'lodash.groupby';

import { PixelLoader } from 'modules/spinners';
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
    project,
    onSubmit,
    setArchiveId,
    fetchData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const statuses = useSelector(getStatuses);

    const groupedReferences = groupBy(registryEntry.registry_references, 'archive_id');
    const referencesCount = Object.values(registryEntry.registry_references).length;
    const archiveIds = Object.keys(groupedReferences);

    useEffect(() => {
        archiveIds.map(archiveId => {
            if (!statuses['interviews'][archiveId]) {
                fetchData({ projectId, locale, project }, 'interviews', archiveId);
            }
        })
    }, [isLoggedIn]);

    useEffect(() => {
        archiveIds.map(archiveId => {
            if (!statuses['title']?.[`for_interviews_${archiveId}`]) {
                fetchData({ projectId, locale, project }, 'interviews', archiveId, 'title');
            }
        })
    }, [isLoggedIn]);

    const archiveIdsWithTitles = archiveIds.reduce((acc, archiveId) => {
        const interviewTitle = isLoggedIn ? interviews[archiveId]?.title?.[locale] : interviews[archiveId]?.anonymous_title[locale];
        acc[archiveId] = interviewTitle;
        return acc;
    }, {});

    let loaded = Object.values(archiveIdsWithTitles).reduce((acc, title) => acc + (title ? 1 : 0), 0);
    archiveIds.sort((a, b) => archiveIdsWithTitles[a]?.localeCompare(archiveIdsWithTitles[b]));

    return (
        <>
            <h4>
                {referencesCount}
                &nbsp;
                {(referencesCount === 1) ? t('activerecord.models.registry_reference.one') : t('activerecord.models.registry_reference.other')}
                {referencesCount > 0 ? ':' : ''}
            </h4>
            <br/>
            {
                loaded < archiveIds.length ? <PixelLoader/> :
                <ul className="UnorderedList">
                    {
                        archiveIds.map(archiveId => {
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
                                        {`${t('activerecord.models.registry_reference.one')} ${t('in')} ${archiveIdsWithTitles[archiveId]} (${archiveId})`}
                                    </Link>
                                    <p>
                                        {
                                            isLoggedIn && groupedReferences[archiveId].filter(ref => ref.ref_object_type === 'Segment').map(ref => {
                                                return <RefObjectLinkContainer registryReference={ref} onSubmit={onSubmit} />
                                            }).reduce((accu, elem) => {
                                                return accu === null ? [elem] : [...accu, ', ', elem]
                                            }, null)
                                        }
                                    </p>
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </>
    )
}
